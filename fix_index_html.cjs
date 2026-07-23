const fs = require('fs');

let code = fs.readFileSync('index.html', 'utf8');

const googTe = `<div id="google_translate_element" style="display:none;"></div>
    <script type="text/javascript">
      function googleTranslateElementInit() {
        new google.translate.TranslateElement({pageLanguage: 'en', autoDisplay: false}, 'google_translate_element');
      }
    </script>
    <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>`;

code = code.replace(googTe, "");
fs.writeFileSync('index.html', code);
