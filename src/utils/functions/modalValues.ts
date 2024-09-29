// Função utilitária para criar ou atualizar objetos aninhados
export const setNestedValue = (
  obj: any,
  path: string[],
  value: string | number | Date | { id: number; value: string }
) => {
  const lastKey = path.pop()!;
  const lastObj = path.reduce((acc, key) => {
    if (!acc[key] || typeof acc[key] !== "object") {
      acc[key] = {};
    }
    return acc[key];
  }, obj);
  lastObj[lastKey] = value;
};

// Função para obter valores aninhados de forma segura
export const getNestedValue = (obj: any, path: string[]) => {
  let value = path.reduce(
    (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
    obj
  );
  if (value && typeof value === "object" && "id" in value) {
    value = value.value;
  }
  return value;
};