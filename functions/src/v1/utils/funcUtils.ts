class FuncUtils {
  static get genVerCode(): string {
    return [
      Math.floor(Math.random()*9), Math.floor(Math.random()*9),
      Math.floor(Math.random()*9), Math.floor(Math.random()*9),
    ].join("");
  }
}

export default FuncUtils;
