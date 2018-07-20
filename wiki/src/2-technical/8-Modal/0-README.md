# کلاس Modal

این کلاس برای نمایش Modal (پنجره درون صفحه ای) و عملیات های مربوط به آن طراحی شده است. این کلاس با new Modal(config) ساخته می شود و در آبجکت config می توان تنظیمات و رخداد های مورد نظر را به کلاس ارائه داد تا به صورت کاملا مستقل به انجام اموری که مد نظر داریم برسد

کارهایی مانند ارائه تابع Callback برای اجرا پس از ساخته شدن، نمایش دادن، از بین رفتن یا تنظیماتی مانند رنگ مودال، افکت مودال، راست چین بودن و ... که این امکان را به ما می دهد که به صورت کاملا ماژولار امکان ساخت و کنترل مودال ها را داشته باشیم

این کلاس داری متدهای داخلی createFooter، createHeader، crateContent می باشد که به ساخت دیتای داخلی مودال بر اساس تنظیمات ارائه شده توسط فرد می پردازد.

{% include "./1-showMethod.md" %}

{% include "./2-destoryMethod.md" %}