import { NextRequest, NextResponse } from 'next/server';
import { generateToken, checkRateLimit, getClientIP, verifyPassword, hashPassword } from '@/lib/auth';
import { validate, loginSchema } from '@/lib/validation';

// 从环境变量获取密码哈希，如果没有则使用默认密码的哈希
// 生产环境必须设置 ADMIN_PASSWORD_HASH
const getPasswordHash = async () => {
  if (process.env.ADMIN_PASSWORD_HASH) {
    return process.env.ADMIN_PASSWORD_HASH;
  }
  // 兼容旧的明文密码配置
  const plainPassword = process.env.ADMIN_PASSWORD || 'admin123';
  return hashPassword(plainPassword);
};

// POST - 登录验证
export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);
  
  // Rate Limiting: 每分钟最多 5 次登录尝试
  const rateLimit = checkRateLimit(`auth:${clientIP}`, { maxRequests: 5, windowMs: 60000 });
  
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { 
        success: false, 
        error: `请求过于频繁，请 ${Math.ceil(rateLimit.resetIn / 1000)} 秒后重试` 
      },
      { 
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(rateLimit.resetIn / 1000)),
          'X-RateLimit-Remaining': '0',
        }
      }
    );
  }

  try {
    const body = await request.json();
    
    // 输入验证
    const validation = validate(loginSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const { password } = validation.data;
    const passwordHash = await getPasswordHash();
    
    // 验证密码
    const isValid = await verifyPassword(password, passwordHash);
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: '密码错误' },
        { 
          status: 401,
          headers: {
            'X-RateLimit-Remaining': String(rateLimit.remaining),
          }
        }
      );
    }

    // 生成 JWT Token
    const token = generateToken({ role: 'admin' });

    return NextResponse.json({
      success: true,
      message: '登录成功',
      token,
      expiresIn: '24h',
    });
  } catch (error) {
    console.error('登录验证失败:', error);
    return NextResponse.json(
      { success: false, error: '验证失败' },
      { status: 500 }
    );
  }
}

// GET - 验证 Token 是否有效
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { success: false, valid: false },
      { status: 401 }
    );
  }

  const token = authHeader.replace('Bearer ', '');
  
  try {
    const { verifyToken } = await import('@/lib/auth');
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { success: false, valid: false, error: 'Token 无效或已过期' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      valid: true,
      payload: { role: payload.role },
    });
  } catch {
    return NextResponse.json(
      { success: false, valid: false },
      { status: 401 }
    );
  }
}
