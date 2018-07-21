<h1>
 		کلاس TetrisGame
		<a class="ext-link" href="module-classes_Tetris_TetrisGame.html" >سورس</a>
</h1>

کلاس اصلی برنامه TetrisGame می باشد که برای شروع بازی و برقراری ارتباط بین کلاس های دیگر، توابع اصلی بازی را نگهداری میکند.

**نکته**: برای اینکه بتوانیم توسعه پذیری را به بازی اضافه کنیم کاربر می تواند با فراخوانی متد init تنظیمات مورد نظر خود را در قالب یک Object به کلاس ارائه دهد و سپس متد build را صدا زده و بازی را بسازد ، این تنظیمات امکان کانفیگ تقریبا تمام مسائل و رخدادهای بازی را به فرد صاحب بازی ارائه میدهد ما این کار را در Arshloader متد initGame انجام داده ایم. با فرض اینکه تیمی به نام عرش می خواهد بازی را customize کند. یک loader طراحی کرده و در بخش شروع بازی init کرده و سپس build انجام داده ایم.

برای مثال در هنگام init کردن بازی تنظیمات بازی به صورت ورودی زیر به TetrisGame.init پاس داده شده است :

<table>
  <tr>
    <td>توضیح</td>
    <td>Value type</td>
    <td>Config name</td>
  </tr>
  <tr>
    <td>تعداد سطرهای پیش فرض برنامه</td>
    <td>int</td>
    <td>rows</td>
  </tr>
  <tr>
    <td>تعداد سطرهای برنامه در گوشی موبایل</td>
    <td>int</td>
    <td>mobileRows</td>
  </tr>
  <tr>
    <td>حداقل طول ستون ها</td>
    <td>int</td>
    <td>columnsMin</td>
  </tr>
  <tr>
    <td>حداکثر طول ستونها</td>
    <td>int</td>
    <td>columnsMax</td>
  </tr>
  <tr>
    <td>تعداد کلمه های منتخب همزمان</td>
    <td>int</td>
    <td>workingWordCount</td>
  </tr>
  <tr>
    <td>سرعت آمدن کاراکتر(در مراحل بالاتر بر شماره مرحله تقسیم میشود و سرعت با ضریبی از مرحله افزایش می یابد)</td>
    <td>int</td>
    <td>charSpeed</td>
  </tr>
  <tr>
    <td>استفاده اجباری از حالت کوچک حروف</td>
    <td>boolean</td>
    <td>useLowerCase</td>
  </tr>
  <tr>
    <td>سرعت ریزش کاراکتر در مرحله ساده</td>
    <td>int</td>
    <td>simpleFallDownAnimateSpeed</td>
  </tr>
  <tr>
    <td>سرعت ریزش کاراکتر در مرحله معمولی</td>
    <td>int</td>
    <td>mediumFallDownAnimateSpeed</td>
  </tr>
  <tr>
    <td>سرعت ریزش کاراکتر در مرحله پیشرفته</td>
    <td>int</td>
    <td>expertFallDownAnimateSpeed</td>
  </tr>
  <tr>
    <td>فاصله بین ریزش حروف کلمه موفق</td>
    <td>int</td>
    <td>successAnimationIterationDuration</td>
  </tr>
  <tr>
    <td>طول زمان ویبره گوشی در زمان منفجرشدن بمب</td>
    <td>int</td>
    <td>vibrationDuration</td>
  </tr>
  <tr>
    <td>فعال بودن حالت ویبره در اثر انفجار بمب</td>
    <td>boolean</td>
    <td>do_vibrate</td>
  </tr>
  <tr>
    <td>فعال بودن حالت لرزش صفحه اصلی در اثر انفجار بمب</td>
    <td>boolean</td>
    <td>do_shake</td>
  </tr>
  <tr>
    <td>فعال بودن رمزنگاری داده های بازی</td>
    <td>boolean</td>
    <td>do_encryption</td>
  </tr>
  <tr>
    <td>طول کلید رمزنگاری AES</td>
    <td>int</td>
    <td>encryptionKeySize</td>
  </tr>
  <tr>
    <td>بررسی کلمات در مسیرهای</td>
    <td>Object</td>
    <td>directionWordChecks</td>
  </tr>
  <tr>
    <td>بررسی از چپ به راست</td>
    <td>boolean</td>
    <td>directionWordChecks.ltr</td>
  </tr>
  <tr>
    <td>بررسی از راست به چپ</td>
    <td>boolean</td>
    <td>directionWordChecks.rtl</td>
  </tr>
  <tr>
    <td>بررسی از بالا به پایین</td>
    <td>boolean</td>
    <td>directionWordChecks.ttd</td>
  </tr>
  <tr>
    <td>بررسی پایین به بالا</td>
    <td>boolean</td>
    <td>directionWordChecks.dtt</td>
  </tr>
  <tr>
    <td>تابع سازنده امتیاز بازی</td>
    <td>function</td>
    <td>scoreCalculator</td>
  </tr>
  <tr>
    <td>نوع دسته بندی انتخابی کاربر</td>
    <td>object</td>
    <td>chooseedWordKind</td>
  </tr>
  <tr>
    <td>فعال بودن پخش صدای پس زمینه</td>
    <td>boolean</td>
    <td>playBackgroundSound</td>
  </tr>
  <tr>
    <td>فعال بودن پخش صدای رخدادهای بازی</td>
    <td>boolean</td>
    <td>playEventsSound</td>
  </tr>
  <tr>
    <td>سطح بازی به صورت پیش فرض</td>
    <td>int</td>
    <td>level</td>
  </tr>
  <tr>
    <td>فعال بودن استفاده از انیمیشن</td>
    <td>boolean</td>
    <td>useAnimationFlag</td>
  </tr>
  <tr>
    <td>فعال بودن نمایش جداکننده های سطری</td>
    <td>boolean</td>
    <td>showGrids</td>
  </tr>

  <tr>
    <td>فعال بودن کاراکترهای ویژه</td>
    <td>boolean</td>
    <td>enable_special_characters</td>
  </tr>

  <tr>
    <td>حالت رنگ بندی(۰ روز - ۱ شب) پیش فرض براساس ساعت سیستم تصمیم میگیرد</td>
    <td>int</td>
    <td>colorMode</td>
  </tr>
</table>

این تنظیمات می تواند توسط شخصی که می خواهد بازی را بر روی سرور اجرا کند به صورت اختصاصی به تابع init داده شوند تا امکانات کامل سیستم را customize کرد.

تابع setDefaultValues نیز متغیرهای پیش فرض بازی را ست می کند که در طول بازی مورد استفاده قرار میگیرد.

{% include "./1-buildMethod.md" %}

{% include "./2-validColumnsNumberMethod.md" %}

{% include "./3-checkWordSuccessMethod.md" %}

{% include "./4-checkWordsResultMethod.md" %}

{% include "./5-checkSuccessWordStackMethod.md" %}

{% include "./6-showShuffleWordsMethod.md" %}

و یکسری متدهای داخلی که برای انجام اموری کوچک که جزئی از فعالیت های داخلی هستند در این کلاس قرار گرفته اند.
