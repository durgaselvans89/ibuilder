

function dispatcher(callbacks)
{
    var _callbacks = {},
        _nameRegExp = /^[a-z0-9\.]+$/i;

    function validateName(name)
    {
        if (!name) {
            return false;
        } else if (!(_nameRegExp instanceof RegExp)) {
            return false;
        }

        return _nameRegExp.test(name);
    }

    function matchCallbacks(name)
    {
        var matchRegExp,
            matches = {},
            a;

        if (!validateName(name)) {
            return;
        }

        matchRegExp = '^' + name.replace('.', '\\.');

        if (name.charAt(name.length - 1) != '.') {
            matchRegExp += '(\\..+)?$';
        }

        matchRegExp = new RegExp(matchRegExp);

        for (a in _callbacks) {
            if (!matchRegExp.test(a)) {
                continue;
            }

            matches[a] = _callbacks[a];
        }

        return matches;
    }

    this.bind = function(name, callback)
    {
        if (!validateName(name) || typeof callback !== 'function') {
            return;
        }

        if (typeof _callbacks[name] !== 'object') {
            _callbacks[name] = [];
        }

        _callbacks[name].push(callback);
    };

    this.bindMultiple = function(callbacks)
    {
        var a;

        if (typeof callbacks !== 'object') {
            return;
        }

        for (a in callbacks) {
            this.bind(a, callbacks[a]);
        }
    };

    this.dispatch = function(name, data)
    {
        var matches = matchCallbacks(name),
            a,
            b;

        for (a in matches) {
            for (b in _callbacks[a]) {
                _callbacks[a][b](data);
            }
        }
    };

    this.unbind = function(name)
    {
        var matches = matchCallbacks(name),
            a;

        for (a in matches) {
            delete _callbacks[a];
        }
    };

    this.bindMultiple(callbacks);
}
