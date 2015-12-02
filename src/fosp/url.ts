// fosp urls

interface User {
  name: string,
  domain: string
}

export class URL {
  user: User;
  path: string;

  constructor(string: string) {
    var i = string.indexOf("/");
    if (i === -1)
      i = string.length;
    var user = string.substr(0, i);
    this.path = string.substr(i, string.length);
    if (this.path === '')
      this.path = '/';

    if (!user.match(/^[a-zA-Z0-9_\-.]+@[a-zA-Z0-9_\-.]+$/)) {
      console.error('Invalid user in url: ' + string);
      throw new Error("Invalid user");
    }
    i = user.indexOf("@");
    this.user = { name: user.substr(0, i), domain: user.substr(i + 1, user.length) };
  }

  toString() {
    return this.user.name + "@" + this.user.domain + this.path;
  }
}
