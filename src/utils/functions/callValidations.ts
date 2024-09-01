import { cpf } from "../validations/cpf";
import { password } from "../validations/password";

const functionRegistry: { [key: string]: Function } = {
  password,
  cpf
};

export function callValidations(functionName: string, ...args: any[]): any {
  const func = functionRegistry[functionName];
  
  if (typeof func === "function") {
    return func(...args); 
  } else {
    console.error(`Function ${functionName} not found.`);
    return null;
  }
}