export class BaseModel {
  public constructor(values: {} = {}) {
    Object.assign(this, values);
  }
}
