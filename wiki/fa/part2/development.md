# راه اندازی برای توسعه

#### گام اول

-   ابتدا بنا به سیستم عاملتون [Node.js](https://nodejs.org/en/) را نصب کنید.

#### گام دوم

-   بعد از نصب [Node.js](https://nodejs.org/en/) دستور زیر را در ترمینال وارد کنید.
-   `npm install -g yarn`

#### گام سوم

-   به محل قرارگیری فایل های پروژه رفته و دستور زیر را در ترمینال بزنید.
-   `yarn`
-   منتظر بمانید تا همه ی پکیج ها نصب شوند

#### گام چهارم

-   بعد از اتمام گام سوم دستور زیر را در ترمینال بزنید.
-   `yarn run dev`

تبریک!! حالا مرورگر باز شده و به ادیتور خود رفته و با هر تغییر به صورت خودکار صفحه بارگزاری مجدد می شود

#### گام پنجم: منتشر

بعد از اینکه کارهای توسعه و غیره تمام شد و قصد انتشار برنامه را دارید دستور زیر را در ترمینال جاری پروژه بزنید:

-   `yarn run build`

فولدر ‍`dist` در محل پروژه ساخته شده که بهینه سازی شده است جهت منتشر کردن. می توانید با آپلود این فولدر بر روی سرور رسما برنامه را منتشر کنید