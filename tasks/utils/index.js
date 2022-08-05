const capitilize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const removeNonWordChars = (string) => string.replace(/[\W]+/g, '');

const set = (obj, path, value) => {
  const paths = path.split('.');

  for (let i = 0; i < paths.length - 1; i++) {
    if (!obj[paths[i]] || !typeof (obj[paths[i]] === 'object')) {
      // check if next path is an index
      obj[paths[i]] = Number.isInteger(Number(paths[i + 1])) ? [] : {};
    }
    obj = obj[paths[i]];
  }
  obj[paths[paths.length - 1]] = value;
};

const toPrimitiveType = (value) => {
  if (Number.isInteger(value)) {
    return 'Int';
  }
  if (typeof value == 'boolean') {
    return 'Boolean';
  }
  if (typeof value === 'number') {
    return 'Float';
  }
  return 'String';
};

const toSchema = (jsonObj) => {
  const result = {};
  const stack = [{ obj: jsonObj, path: '' }];

  while (stack.length > 0) {
    const { obj, path } = stack.pop();

    Object.entries(obj).forEach(([key, value]) => {
      if (!Array.isArray(value) && !(typeof value === 'object')) {
        const newValue = toPrimitiveType(value);
        const newPathPrefix = path ? `${path}.` : '';
        set(result, `${newPathPrefix}${removeNonWordChars(key)}`, newValue);
        return;
      }

      const pathPrefix = path ? `${path}.` : '';
      const newPath = `${pathPrefix}${removeNonWordChars(key)}`;

      if (Array.isArray(value)) {
        value = [value[0]];
      }

      stack.push({
        obj: value,
        path: newPath,
      });
    });
  }
  return result;
};

const toSDLString = (schema, typename) => {
  let string = '';

  for (let [key, value] of Object.entries(schema)) {
    if (Array.isArray(value) && typeof value[0] === 'object') {
      const newTypeName = capitilize(key);
      string += toSDLString(value[0], newTypeName);
      schema[key][0] = newTypeName;
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      const newTypeName = capitilize(key);
      string += toSDLString(value, newTypeName);
      schema[key] = newTypeName;
    }
  }

  return `${string}\n\n type ${typename} ${JSON.stringify(schema).replace(
    /"/g,
    ''
  )}`;
};

export { toSchema, toSDLString };
