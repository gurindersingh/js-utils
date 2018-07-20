export default class Utils {

    /*
    Encode url
     */
    static urlEncode(str) {
        str = str.split('/').join('%2F');
        str = str.split('#').join('%23');
        str = str.split('&').join('%26');
        str = str.split('=').join('%3D');
        str = str.split('?').join('%3F');
        return str;
    }

    static htmlEntities(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    /*
    * Get count of depth nested objects by key
    */
    static countObjectDepth(Obj, $key = 'children') {

        let count = Obj[$key].length;

        for (let i = 0; i < Obj[$key].length; i++) {

            count += Utils.countObjectDepth(Obj[$key][i], $key);
        }

        return count;
    }

    /*
    Get value of field from url
    www.example.com?foo=bar
    use -> getQueryString('foo', url) -> bar / null

    @param string url
    @param string foo
    @return string | null
     */
    static getQueryString(field, url) {
        let href = url ? url : window.location.href;

        let reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');

        let string = reg.exec(href);

        return string ? string[1] : null;
    }

    /*
    addProps(myObj, 'sub1.sub2.propA', 1);
    addProps(myObj, ['sub1', 'sub2', 'propA'], 1);
    https://stackoverflow.com/questions/17643965/automatically-create-object-if-undefined#answer-34205057
     */
    static addProps(obj, arr, val) {
        if (typeof arr === 'string') {
            arr = arr.split(".")
        }

        obj[arr[0]] = obj[arr[0]] || {};

        let tmpObj = obj[arr[0]];

        if (arr.length > 1) {
            arr.shift();
            Utils.addProps(tmpObj, arr, val);

        } else {

            obj[arr[0]] = val;

        }

        return obj;

    }

    /**
     * Get the value from an object by the given key.
     *
     * example: get('a.b', {a: {b: c}}, 'default value')
     */
    static get(key, object, def = null) {
        return key.toString().split('.').reduce((t, i) => t[i] || def, object);
    }

    static objIsEmpty(obj) {
        return Object.getOwnPropertyNames(obj).length === 0;
    }

    static highlight(text, keywords) {
        return text.replace(new RegExp(keywords, 'gi'), '<span class="highlighted">$&</span>');
    }

    static uniqueId() {
        let d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    /*
    sort objects by keys
    { c: 'vc', a: 'va' } -> { a: 'va', c: 'vc' }
     */
    static sortObjectByKeys(obj) {
        return Object.keys(obj).sort().reduce((r, k) => (r[k] = obj[k], r), {})
    }

    static slugify(str) {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.replace(/\-\-+/g, '-')     // Replace multiple - with single -
        str = str.replace(/^-+/, '')         // Trim - from start of text
        str = str.replace(/-+$/, '');        // Trim - from end of text
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        let from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
        let to = "aaaaeeeeiiiioooouuuunc------";
        for (let i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }

    /*
    @return America/Toronto
     */
    static getLocalTimeZoneName() {
        let timezone = Utils.getTimeZone();

        return timezone.name();
    }

    static months($small = false) {
        if($small) {
            return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        }
        return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    }

    static arrayOfYearsInBackward(years = 100) {

        let result = [];

        let currentYear = new Date().getFullYear();

        let targetYear = currentYear - years;

        for (let i = currentYear; i > targetYear; i--) {

            result.push(i);

        }

        return result;
    }

    /*
    obj = {}
    use it -> nestObject(obj, 'nested.obj.key', null)
    result obj = { nested : { obj: { key: null } } }
     */
    static nestObject(state, path, value) {
        let names = path.split('.');

        for (let i = 0, len = names.length; i < len; i++) {
            if (i === (len - 1)) {
                state = state[names[i]] = state[names[i]] || value;
            }
            else if (parseInt(names[i + 1]) >= 0) {
                state = state[names[i]] = state[names[i]] || [];
            }
            else {
                state = state[names[i]] = state[names[i]] || {};
            }
        }
    }

    /*
    obj = { path : { to: { key : null } } }
    objHasKeys(obj, ['path', 'to', 'the', 'key']
     */
    static objHasKeyArray(obj, keys) {
        let key = keys.shift();
        return obj[key] && (!keys.length || Utils.objHasKeyArray(obj[key], keys));
    }

    /*
    obj = { path : { to: { key : null } } }
    objHasKeys(obj, ['path.to.the.key']
     */
    static objHasKey(obj, keys) {
        // Get property array from key string
        return Utils.objHasKeyArray(obj, keys.split("."));
    }

}
