// ==UserScript==
// @name         Card style View in Google result
// @namespace    https://twitter.com/yume_yu
// @homepage     https://github.com/yume-yu/CardStyleView-in-GoogleResult
// @supportURL   https://twitter.com/yume_yu
// @version      0.5.5
// @description  This scripts add cardView to your GoogleSearchResult.
// @author       @yume_yu
// @match        https://www.google.com/search*
// @match        https://www.google.co.jp/search*
// @grant        none
// @updateURL    https://github.com/yume-yu/CardStyleView-in-GoogleResult/raw/master/CardStyleView-in-GoogleResult.user.js
// @downloadURL  https://github.com/yume-yu/CardStyleView-in-GoogleResult/raw/master/CardStyleView-in-GoogleResult.user.js
// ==/UserScript==

(function() {
    var invisibleStyleStr = ".invisible { display:none;}"
    var widthValues = {
            "Origin * 2/3":"592px * 2/3",
            "Origin * 1/2":"592px * 1/2",
            "4cards / Line":"22%",
            "5cards / Line":"18%",
    };
    var isImageSearch = /tbm=/g
    if(document.URL.match(isImageSearch)){
        return;
    }else{
        /* defaultmode "list" or "card" */
        var defaultmode;
        var cardWidth;
        defaultmode = localStorage.cardViewDefault;
        cardWidth = localStorage.widthValue;
        if(typeof defaultmode == "undefined"){
            localStorage.setItem("cardViewDefault","list");
            defaultmode = "list";
            console.log("none")
        }
        if(typeof cardWidth == "undefined"){
            localStorage.setItem("widthValue",widthValues["original * 2/3"]);
            cardWidth = widthValues["original * 2/3"];
            console.log("none")
        }
        var css_before =  ' .mw {\
max-width:none;\
}\
#fld {\
display:none;\
}\
#rhs {\
display:none;\
}\
\
div.col {\
width:100%;\
}\
\
#cnt #center_col{\
width:calc(100vw - 2 * 75px);\
/*width: 100vw*/\
}\
\
.mw #center_col {\
/*margin-left: 0 !important;\
margin-right: 0 !important;*/\
\
margin-left: 75px !important;\
margin-right: 75px;\
\
}\
\
.g cite {\
word-break:break-all;\
overflow-wrap:anywhere;\
hyphens: auto;\
}\
#bottomads {\
display: none;\
}\
.g-blk {\
display:none;\
}\
/*各検索結果項目*/\
.cardList .g {\
line-height: 1.6;\
text-align: left;\
padding: 3%;\
/*width: 22%;*/\
border: 1px solid gray;\
border-radius: 1rem;\
box-shadow: 5px 5px 5px 1px rgba(200, 200, 200, 0.8);\
}\
/*各検索結果項目*/\
.cardList .g:hover {\
border:1px solid gray;\
box-shadow: 10px 10px 7px 1px rgba(200, 200, 200, 0.4);\
}\
div.srg {\
width:  100%;\
display: grid;\
grid-template-columns: repeat(auto-fill, calc(';
        var css_after =  '));\
justify-content: space-around;\
grid-column-gap: 13px;\
\
/*\
display: flex;\
justify-content: space-between;\
flex-wrap: wrap;\
*/\
}\
\
g-section-with-header{\
margin:0;\
}\
\
g-scrolling-carousel{\
margin:0 !important;\
}\
.card-section .brs_col{\
display:flex;\
}\
\
#bottomads+.med{\
/*margin-left:150px;*/\
}\
\
/*画像検索の結果*/\
div#imagebox_bigimages.g  g-section-with-header{\
overflow:auto;\
}\
.exp-outline {\
    display: none;\
}\
\
/* タイトル表示崩れ対策 */ \
.ellip {\
  white-space:normal;\
}\
\
div.r {\
  white-space:normal !important;\
}\
/* 翻訳カード表示崩れ対策 */ \
.vk_c {\
  margin : 0;\
}\
\
}';
        var css = css_before + cardWidth + css_after;
        var button = document.createElement("div");
        button.name= "switchCard";
        button.id="switch";
        button.className += document.querySelector("#tsf div:nth-of-type(2) div:first-of-type button").className
        var buttonStyle = {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width : "112px",
            //height : "100%",
            padding:0,
            position : "absolute",
            backgroundColor : "rgba(22,90,226,1)",
            zIndex : 999,
            textAlign:"center",
            borderRadius: "2rem",
            //top: "20px",
            left: "807px"
        }
        for(var buttonstyleKey in buttonStyle){
            button.style[buttonstyleKey] = buttonStyle[buttonstyleKey];
        }
        var label = document.createElement("a");
        label.textContent = "toCardStyle"
        var labelStyle = {
            display: "block",
            cursor: "pointer",
            textAlign: "center",
            padding: "0.5em 1em",
            width: "100%",
            color: "white",
            fontSize: "14px",
            fontWeight: "bold",
            userSelect:"none",
            textDecoration:"none"
        }
        for(var astyleKey in labelStyle){
            label.style[astyleKey] = labelStyle[astyleKey];
        }

        button.addEventListener("click", function() {
            if(document.getElementById("cardstyle") != null){
                document.getElementsByTagName("body")[0].removeChild(document.getElementById("cardstyle"));
                document.getElementById("switch").firstChild.textContent="toCardStyle";
                for(var g in [...Array(document.getElementById("rso").children.length).keys()]){
                    try{
                        document.getElementById("rso").children[g].classList.toggle("invisible")
                    }catch(e){
                        console.log(e);
                    }
                }
                localStorage.cardViewDefault = "list";
            }else{
                var style = document.createElement("style");
                style.id = "cardstyle";
                style.textContent = css;
                var center_col = document.getElementById("center_col");
                var body = document.getElementsByTagName("body")[0];
                var child = center_col.firstElementChild;
                if(document.getElementById("invisible") == null){
                    var invisible = document.createElement("style");
                    invisible.id = "invisible";
                    invisible.textContent = invisibleStyleStr;
                    body.appendChild(invisible);
                }
                body.appendChild(style);
                document.getElementById("switch").firstChild.textContent="toListStyle";
                if(document.getElementsByClassName("cardList").length == 0){
                    var nodeItems = document.querySelectorAll('.g')
                    var items = [...nodeItems]
                    var cardDiv;// = document.createElement("div");
                    var modelcase = document.getElementById("rso");
                    for(var i in modelcase.children){
                        if(modelcase.children[i].getElementsByClassName("srg").length != 0){
                            cardDiv = modelcase.children[i].cloneNode(true);
                            break;
                        }
                    }
                    cardDiv.getElementsByClassName("srg")[0].textContent = "";
                    for(var item in items){
                        cardDiv.getElementsByClassName("srg")[0].append(items[item].cloneNode(true));
                    }

                    cardDiv.className += " cardList invisible"
                    document.getElementById("rso").insertBefore(cardDiv,document.getElementById("rso").firstChild)
                }
                for(g in [...Array(document.getElementById("rso").children.length).keys()]){
                    try{
                        document.getElementById("rso").children[g].classList.toggle("invisible")
                    }catch(e){
                        console.log(g);
                    }
                }
                localStorage.cardViewDefault = "card";
            }
        },false);
        var main = document.getElementById("tophf");
        button.append(label);
        main.append(button);
        //
        var size_button = document.createElement("div");
        size_button.name= "switchCard";
        size_button.className += document.querySelector("#tsf div:nth-of-type(2) div:first-of-type button").className
        for(buttonstyleKey in buttonStyle){
            size_button.style[buttonstyleKey] = buttonStyle[buttonstyleKey];
        }
        size_button.style["background-color"] = "rgba(0,0,0,0)"
        var select = document.createElement("select");
        select.id = "widthMode"
        var selectStyle = {
            //width: "100%",
            //height: "100%",
            "-webkit-appearance": "none",
            "background-color": "rgba(0,0,0,0)",
            //color:"rgb(22, 90, 226)",
            color:"#5f6368",
            border: "none",
            //padding: "0px 16px",
            padding: "4px 11px",
            outline:"none",
            //"border-bottom-left-radius": 0,
            //"border-bottom-right-radius": 0,
            //"border-bottom": "2px solid",
            //fontSize: "14px",
            fontSize: "13px",
        }
        for(var styleKey in selectStyle){
            select.style[styleKey] = selectStyle[styleKey];
        }
        for(i in widthValues){
            var item = document.createElement("option")
            item.textContent = i
            select.append(item)
        }
        for(i in widthValues){
            if(widthValues[i] === cardWidth){
                select.value = i;
                break;
            }
        }
        select.addEventListener("change",function(){
            cardWidth = widthValues[document.getElementById("widthMode").value];
            css = css_before + cardWidth + css_after;
            document.getElementById("cardstyle").textContent = css;
            localStorage.setItem("widthValue",widthValues[document.getElementById("widthMode").value]);
        },false)
        let sub = document.getElementById("hdtb-msb");
        sub.append(" /  Size:")
        sub.append(select)

        if (defaultmode == "card"){
            var invisible = document.createElement("style");
            invisible.id = "invisible";
             invisible.textContent =  invisibleStyleStr;
            //invisible.textContent = ".invisible { display:none;}";
            var style = document.createElement("style");
            style.id = "cardstyle";
            style.textContent = css;
            var center_col = document.getElementById("center_col");
            var body = document.getElementsByTagName("body")[0];
            var child = center_col.firstElementChild;
            body.appendChild(invisible);
            body.appendChild(style);
            document.getElementById("switch").firstChild.textContent="toListStyle";
            if(document.getElementsByClassName("cardList").length == 0){
                var nodeItems = document.querySelectorAll('.g')
                var items = [...nodeItems]
                var cardDiv;// = document.createElement("div");
                var modelcase = document.getElementById("rso");
                for(var i in modelcase.children){
                    if(modelcase.children[i].getElementsByClassName("srg").length != 0){
                        cardDiv = modelcase.children[i].cloneNode(true);
                        break;
                    }
                }
                cardDiv.getElementsByClassName("srg")[0].textContent = "";
                for(var item in items){
                    cardDiv.getElementsByClassName("srg")[0].append(items[item].cloneNode(true));
                }

                cardDiv.className += " cardList invisible"
                document.getElementById("rso").insertBefore(cardDiv,document.getElementById("rso").firstChild)
            }
            for(var g in [...Array(document.getElementById("rso").children.length).keys()]){
                try{
                    document.getElementById("rso").children[g].classList.toggle("invisible")
                }catch(e){
                    console.log(g);
                }
            }
        }
    }
})();
