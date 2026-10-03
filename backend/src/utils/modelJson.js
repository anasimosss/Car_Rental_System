const serializeValue = (value) => {
  if (Array.isArray(value)) return value.map(serializeValue);
  if (!value || typeof value !== 'object') return value;

  const result = Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, serializeValue(item)])
  );
  if (result.id !== undefined) result._id = result.id;
  return result;
};

const serializeModel = (model, relationNames = {}) => {
  if (!model) return model;
  const result = serializeValue(model.toJSON());

  for (const [association, field] of Object.entries(relationNames)) {
    if (result[association] !== undefined) {
      result[field] = result[association];
      delete result[association];
    }
  }

  return result;
};

module.exports = serializeModel;