
if (navigator.appName == 'Microsoft Internet Explorer' && location.toString().indexOf('file')==0) {
	window.XMLHttpRequest = function() {
        try {
            return new ActiveXObject('MSXML2.XMLHTTP.3.0');
        }
        catch (ex) {
            return null;
        }
    }
} 
