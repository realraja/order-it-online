 const setCookieDay = process.env.DAY_COOKIE || 700;

 export const setCookie = async (res,token,path = '/',name='token') => {
    await res.cookies.set(name, token, {
          httpOnly: true,
          secure: true,
          maxAge: setCookieDay * 24 * 60 * 60,
          path: path,
          sameSite: "strict",
        });
}