# ساختار کلی فایل ها و پوشه ها:

```
├── api-docs
│   ├── fonts
│   ├── img
│   ├── scripts
│   │   └── prettify
│   └── styles
├── documents
│   ├── assets
│   │   ├── fonts
│   │   ├── images
│   │   └── styles
│   └── _book
│       ├── assets
│       └── gitbook
├── src
│   ├── assets
│   │   ├── css
│   │   ├── img
│   │   ├── localization
│   │   ├── mp3
│   │   ├── wiki
│   │   └── words
│   └── javascript
│       ├── classes
│       └── loading
├── test
│   └── classes
├── test_result
└── wiki
    ├── assets
    │   ├── fonts
    │   ├── images
    │   └── styles
    ├── _book
    │   ├── assets
    │   ├── en
    │   ├── fa
    │   └── gitbook
    ├── en
    │   └── _book
    └── fa
        ├── assets
        ├── _book
        ├── part1
        └── part2

45 directories
```

کلاس های اختصاصی برنامه در پوشه classes/Tetris و کلاس های عمومی برای توسعه پذیری در پوشه والد یعنی همان classes نوشته شده اند.
