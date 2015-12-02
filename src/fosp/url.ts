// fosp urls
export class URL {
  constructor(string) {
    var i = string.indexOf("/");
    if (i === -1)
      i = string.length;
    this.user = string.substr(0, i);
    this.path = string.substr(i, string.length);
    if (this.path === '')
      this.path = '/';

    if (! this.user.match(/^[a-zA-Z0-9_\-.]+@[a-zA-Z0-9_\-.]+$/)) {
      console.error('Invalid user in url: ' + string);
      throw new Error("Invalid user");
    }
    i = this.user.indexOf("@");
    this.user = { name: this.user.substr(0, i), domain: this.user.substr(i + 1, this.user.length) };
  }

  toString() {
    return this.user.name + "@" + this.user.domain + this.path;
  }
}
