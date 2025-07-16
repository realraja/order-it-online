 const setCookieDay = process.env.DAY_COOKIE || 700;

 export const setCookie = async (res,token,path = '/') => {
    await res.cookies.set("token", token, {
          httpOnly: true,
          secure: true,
          maxAge: setCookieDay * 24 * 60 * 60,
          path: path,
          sameSite: "strict",
        });
}