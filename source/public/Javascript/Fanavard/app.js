/* jshint browser: true */

var EmojiManager;
(function () {

    EmojiManager = function (options) {

        'use strict';

        /**
         * Default options of emoji manager
         * @type {{selector: string, draggable: boolean, title: string, background: string, textColor: string, kindOfSearch: string, afterMenuShow: afterMenuShow, afterChoose: afterChoose, afterClose: afterClose, rtl: boolean, debug: boolean}}
         */
        var defaultOptions = {
            selector: '.searchEmoji',
            draggable: true,
            title: 'انتخاب شکلک',
            background: '#F00000',
            textColor: '#fff',
            kindOfSearch: 'all',   // first , end
            afterMenuShow: function () {
            },
            afterChoose: function () {
            },
            afterClose: function () {
            },
            rtl: true,
            position: 'absolute',    // fixed-top-left , fixed-top-right , fixed-bottom-left , fixed-bottom-right
            debug: false
        };

        var EmojiManager = this;
        var jsonOfEmojies = window.jsonOfEmojies;


        /**
         * Extend object
         *
         * @param out
         * @returns {*|{}}
         */
        this.deepExtend = function (out) {
            out = out || {};

            for (var i = 1; i < arguments.length; i++) {
                var obj = arguments[i];

                if (!obj)
                    continue;

                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === 'object')
                            out[key] = EmojiManager.deepExtend(out[key], obj[key]);
                        else
                            out[key] = obj[key];
                    }
                }
            }

            return out;
        };


        /*
        Overload default settings on user options
         */
        this.settings = this.deepExtend({}, defaultOptions, options);
        this.firstRun = true;

        this.isBrowser = (typeof window !== 'undefined');

        /**
         * Function to get current caret position
         *
         * @param textarea
         * @param mode
         * @param options
         * @returns {{top: number, left: number}}
         */
        this.getCaretCoordinates = function (textarea, mode, options) {
            var targetElement = textarea;

            // HTML Sanitizer
            var escapeHTML = function (s) {
                var obj = document.createElement('pre');
                obj[typeof obj.textContent !== 'undefined' ? 'textContent' : 'innerText'] = s;
                return obj.innerHTML;
            };

            // Get caret character position.
            var getCaretPosition = function (element) {
                var startpos = -1;
                var endpos = -1;
                if (document.selection) {
                    // IE Support(not yet)
                    var docRange = document.selection.createRange();
                    var textRange = document.body.createTextRange();
                    textRange.moveToElementText(element);

                    var range = textRange.duplicate();
                    range.setEndPoint('EndToStart', docRange);
                    startpos = range.text.length;

                    var rangeEnd = textRange.duplicate();
                    rangeEnd.setEndPoint('EndToEnd', docRange);
                    endpos = rangeEnd.text.length;
                } else if (element.selectionStart || element.selectionStart === '0') {
                    // Firefox support
                    startpos = element.selectionStart;
                    endpos = element.selectionEnd;
                }
                return {start: startpos, end: endpos};
            };

            // Get element css style.
            var getStyle = function (element) {
                return element.currentStyle || document.defaultView.getComputedStyle(element, '');
            };

            // Get element absolute position
            var getElementPosition = function (element) {
                // Get scroll amount.
                var html = document.documentElement;
                var body = document.body;
                var scrollLeft = (body.scrollLeft || html.scrollLeft);
                var scrollTop = (body.scrollTop || html.scrollTop);

                // Adjust "IE 2px bug fix" and scroll amount.
                var rect = element.getBoundingClientRect();
                var left = rect.left - html.clientLeft + scrollLeft;
                var top = rect.top - html.clientTop + scrollTop;
                var right = rect.right - html.clientLeft + scrollLeft;
                var bottom = rect.bottom - html.clientTop + scrollTop;
                return {
                    left: parseInt(left), top: parseInt(top),
                    right: parseInt(right), bottom: parseInt(bottom)
                };
            };


            // get position main function
            var textAreaPosition = getElementPosition(targetElement);
            var dummyName = targetElement.id + "_dummy";
            var dummyTextArea = document.getElementById(dummyName);
            if (!dummyTextArea) {
                // Generate dummy textarea.
                dummyTextArea = document.createElement("div");
                dummyTextArea.id = dummyName;
                var textAreaStyle = getStyle(targetElement);
                dummyTextArea.style.cssText = textAreaStyle.cssText;

                // Fix for browser differece.
                if (targetElement.wrap === "off") {
                    // chrome, firefox wordwrap=off
                    dummyTextArea.style.overflow = "auto";
                    dummyTextArea.style.whiteSpace = "pre";
                } else {
                    // firefox wordwrap=on
                    dummyTextArea.style.overflowY = "auto";
                }
                dummyTextArea.style.visibility = 'hidden';
                dummyTextArea.style.position = 'absolute';
                dummyTextArea.style.top = '0px';
                dummyTextArea.style.left = '0px';

                // Firefox Support
                dummyTextArea.style.width = textAreaStyle.width;
                dummyTextArea.style.height = textAreaStyle.height;
                dummyTextArea.style.fontSize = textAreaStyle.fontSize;
                dummyTextArea.style.maxWidth = textAreaStyle.width;
                dummyTextArea.style.backgroundColor = textAreaStyle.backgroundColor;
                dummyTextArea.style.fontFamily = textAreaStyle.fontFamily;

                targetElement.parentNode.appendChild(dummyTextArea);
            }

            // Set scroll amount to dummy textarea.
            dummyTextArea.scrollLeft = targetElement.scrollLeft;
            dummyTextArea.scrollTop = targetElement.scrollTop;

            // Set code strings.
            var codeStr = options.isDiv ? EmojiManager.gabi_content(targetElement) : targetElement.value;

            // Get caret character position.
            var selPos = getCaretPosition(targetElement);
            var leftText = codeStr.slice(0, selPos.start);
            var selText = codeStr.slice(selPos.start, selPos.end);
            var rightText = codeStr.slice(selPos.end, codeStr.length);
            if (selText === '') selText = "a";

            // Set keyed text.
            var processText = function (text) {
                // Get array of [Character reference] or [Character] or [NewLine].
                var m = escapeHTML(text).match(/((&amp;|&lt;|&gt;|&#34;|&#39;)|.|\n)/g);
                if (m)
                    return m.join('<wbr>').replace(/\n/g, '<br>');
                else
                    return '';
            };

            // Set calculation text for in dummy text area.
            dummyTextArea.innerHTML = (processText(leftText) +
                '<wbr><span id="' + dummyName + '_i">' + processText(selText) + '</span><wbr>' +
                processText(rightText));

            // Get caret absolutely pixel position.
            var dummyTextAreaPos = getElementPosition(dummyTextArea);
            var caretPos = getElementPosition(document.getElementById(dummyName + "_i"));
            switch (mode) {
                case 'self':
                    // Return absolutely pixel position - (0,0) is most top-left of TEXTAREA.
                    return {
                        left: caretPos.left - dummyTextAreaPos.left,
                        top: caretPos.top - dummyTextAreaPos.top
                    };
                case 'body':
                case 'screen':
                case 'stage':
                case 'page':
                    // Return absolutely pixel position - (0,0) is most top-left of PAGE.
                    return {
                        left: textAreaPosition.left + caretPos.left - dummyTextAreaPos.left,
                        top: textAreaPosition.top + caretPos.top - dummyTextAreaPos.top
                    };
            }
        };


        /**
         * Get content of element
         * @param element
         * @returns {*|string}
         */
        this.gabi_content = function (element) {
            return element.innerText || element.textContent;
        };


        /**
         * Replace last occurence of string with new one
         * @param badtext
         * @param str
         * @param icon
         * @returns {*}
         */
        this.replaceLastText = function (badtext, str, icon) {
            var charpos = str.lastIndexOf(badtext);
            if (charpos < 0) return str;
            var ptone = str.substring(0, charpos);
            var pttwo = str.substring(charpos + (badtext.length)).slice(0, -4);
            return (ptone + icon + pttwo);
        };


        /**
         * Set caret to end position of content editable
         * @param contentEditableElement
         */
        this.setEndOfContenteditable = function (contentEditableElement) {
            var range, selection;
            if (document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
            {
                range = document.createRange();//Create a range (a range is a like the selection but invisible)
                range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
                range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
                selection = window.getSelection();//get the selection object (allows you to change selection)
                selection.removeAllRanges();//remove any selections already made
                selection.addRange(range);//make the range you have just created the visible selection
            }
            else if (document.selection)//IE 8 and lower
            {
                range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
                range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
                range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
                range.select();//Select the range (make it the visible selection
            }
        };


        /**
         * Select editor element with class search emoji
         * @type {HTMLElement | null}
         */
        this.build = function () {


            var searchEmoji = document.querySelector(EmojiManager.settings.selector),
                settings = EmojiManager.settings;

            searchEmoji.addEventListener("click", function () {
                if (EmojiManager.firstRun) {

                    EmojiManager.firstRun = false;

                    if (document.querySelector("#chooseEmoji") === null) {
                        var chooserDiv = document.createElement('div');
                        chooserDiv.setAttribute('id', 'chooseEmoji');
                        document.querySelector('body').appendChild(chooserDiv);
                    }

                    this.innerHTML = '';
                }
            });


            /*
            Add event listener to event
             */
            searchEmoji.addEventListener("input", function (e) {


                var tagName = this.tagName.toLowerCase(),
                    isDiv = (tagName === 'div'),
                    isInput = (tagName === 'input'),
                    allValue = isDiv ? EmojiManager.gabi_content(this).trim() : this.value,
                    allHtml = this.innerHTML,
                    lastSpace = allValue.replace(/\n/g, ' ').lastIndexOf(" "),
                    typedValue = allValue.substring(lastSpace + 1).toLowerCase().replace("<br/>", ""),
                    chooseEmoji = document.getElementById("chooseEmoji"),
                    foundedOne = false,
                    counter = 0,
                    isEnglish = /[^A-Za-z0-9]/g.test(typedValue);

                /*
                 Make list empty and search for emoji
                 */
                chooseEmoji.innerHTML = '<div style="background:' + settings.background + ';' + settings.textColor + ';" class="titleOfBlock ' + ((settings.draggable) ? "draggableTitle" : "") + ((settings.rtl) ? " emojiIsRTL" : "") + '">' + settings.title + '<span class="closeEmojiChooser">×</span></div><ul></ul>';

                for (var i = Object.keys(jsonOfEmojies).length - 1; i >= 0; i--) {
                    var keywordName = (!isEnglish ? jsonOfEmojies[i].keywords : jsonOfEmojies[i].faKeywords);

                    if (
                        typedValue.length > 0 &&
                        (
                            (!isEnglish && jsonOfEmojies[i].keywords.indexOf(typedValue) > -1) ||
                            (isEnglish && jsonOfEmojies[i].faKeywords.indexOf(typedValue) > -1)
                        ) &&
                        counter < 12
                    ) {
                        foundedOne = true;
                        counter++;


                        var li = document.createElement("li"),
                            emojiCode = "<span class='ec ec-" + jsonOfEmojies[i].name + "'></span>";

                        li.dataset.name = jsonOfEmojies[i].name;
                        li.dataset.content = jsonOfEmojies[i].content;
                        li.title = keywordName;
                        li.innerHTML = emojiCode + keywordName;
                        chooseEmoji.querySelector("ul").appendChild(li);

                        // click on emoji li
                        li.addEventListener("click", function () {

                            EmojiManager.settings.afterChoose(this.dataset.name, this);

                            var iconSpan = document.createElement("span"),
                                newIcon = "<span class='ec ec-" + this.dataset.name + "' ></span>";

                            iconSpan.className = "ec ec-" + this.dataset.name;
                            chooseEmoji.style.display = "none";


                            // replace old value with
                            if (isDiv) {
                                searchEmoji.innerHTML = EmojiManager.replaceLastText(typedValue, allHtml, newIcon);
                                EmojiManager.setEndOfContenteditable(searchEmoji);
                            } else {
                                searchEmoji.value = EmojiManager.replaceLastText(typedValue, allValue, this.dataset.content);
                                searchEmoji.focus();
                            }

                        });
                    }
                }


                /*
                If emoji founded show choosing menu
                */
                if (foundedOne) {

                    // show the chooser
                    chooseEmoji.style.display = "block";

                    var topSpace, leftSpace, bottomSpace, rightSpace;


                    // set position
                    switch (settings.position) {
                        case "absolute" :

                            var caret = EmojiManager.getCaretCoordinates(this, 'body', {
                                    isDiv: isDiv,
                                    isInput: isInput
                                }),
                                screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
                                menuWidth = chooseEmoji.clientWidth || chooseEmoji.offsetWidth,
                                newPlaceOfLeft = caret.left - menuWidth;


                            /*
                            Do not let suggest menu out of screen
                             */
                            if (screenWidth - newPlaceOfLeft < 0) {
                                newPlaceOfLeft = screenWidth - menuWidth - 10;   // leftest place of page
                            }


                            topSpace = caret.top + 30 + 'px';
                            leftSpace = newPlaceOfLeft + 'px';
                            bottomSpace = null;
                            rightSpace = null;

                            chooseEmoji.style.position = 'absolute';

                            break;

                        case "fixed-top-right" :
                            chooseEmoji.style.position = 'fixed';
                            bottomSpace = null;
                            rightSpace = '15px';
                            topSpace = '10px';
                            leftSpace = 'auto';
                            break;
                        case "fixed-top-left":
                            chooseEmoji.style.position = 'fixed';
                            bottomSpace = null;
                            rightSpace = null;
                            topSpace = '10px';
                            leftSpace = '10px';
                            break;
                        case "fixed-bottom-right":
                            chooseEmoji.style.position = 'fixed';
                            bottomSpace = '15px';
                            rightSpace = '15px';
                            topSpace = null;
                            leftSpace = null;
                            break;
                        case "fixed-bottom-left":
                            chooseEmoji.style.position = 'fixed';
                            bottomSpace = '15px';
                            rightSpace = null;
                            topSpace = null;
                            leftSpace = '10px';
                            break;
                        default:
                            chooseEmoji.style.position = 'fixed';
                            topSpace = '10px';
                            leftSpace = '10px';
                            bottomSpace = null;
                            rightSpace = null;

                            break;
                    }

                    chooseEmoji.style.top = topSpace;
                    chooseEmoji.style.left = leftSpace;
                    chooseEmoji.style.bottom = bottomSpace;
                    chooseEmoji.style.right = rightSpace;


                    EmojiManager.settings.afterMenuShow(chooseEmoji);


                    /*
                    Handle close menu
                     */
                    chooseEmoji.querySelector(".closeEmojiChooser").addEventListener("click", function () {
                        EmojiManager.settings.afterClose();
                        chooseEmoji.innerText = '';
                        chooseEmoji.style.display = 'none';
                    });


                } else {
                    chooseEmoji.innerHTML = '';
                    chooseEmoji.style.display = 'none';
                }


                /*
                Enable draggable to selector
                 */
                if (settings.draggable) {
                    (function () {
                        var initX, initY, firstX, firstY;

                        chooseEmoji.addEventListener('mousedown', function (e) {
                            e.preventDefault();
                            initX = this.offsetLeft;
                            initY = this.offsetTop;
                            firstX = e.pageX;
                            firstY = e.pageY;

                            this.addEventListener('mousemove', dragIt, false);

                            window.addEventListener('mouseup', function () {
                                chooseEmoji.removeEventListener('mousemove', dragIt, false);
                            }, false);

                        }, false);


                        // mobile device support
                        chooseEmoji.addEventListener('touchstart', function (e) {
                            e.preventDefault();
                            initX = this.offsetLeft;
                            initY = this.offsetTop;
                            var touch = e.touches;
                            firstX = touch[0].pageX;
                            firstY = touch[0].pageY;

                            this.addEventListener('touchmove', swipeIt, false);

                            window.addEventListener('touchend', function (e) {
                                e.preventDefault();
                                chooseEmoji.removeEventListener('touchmove', swipeIt, false);
                            }, false);

                        }, false);

                        function dragIt(e) {
                            this.style.left = initX + e.pageX - firstX + 'px';
                            this.style.top = initY + e.pageY - firstY + 'px';
                        }

                        function swipeIt(e) {
                            var contact = e.touches;
                            this.style.left = initX + contact[0].pageX - firstX + 'px';
                            this.style.top = initY + contact[0].pageY - firstY + 'px';
                        }
                    })();
                }


                // do not let regualar functionality
                e.preventDefault();

            });

        };


        /**
         * Build emojiManger
         */
        this.build();

    };

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = Emojimanager;
    } else if (EmojiManager.isBrowser) {
        window.Emojimanager = Emojimanager;
    }

})();