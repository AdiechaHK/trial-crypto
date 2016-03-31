var gcd = function(a, b) {
  var r, i;
  while(b!=0){
    r = a % b;
    a = b;
    b = r;
  }
  return a;
}

var mCrypt = function(name) {

  function findPublicKey(fi) {
    // public key (e) should be 1 < e < fi & e and fi both should be coPrime
    var key = 0;
    while (true) {
      key = (parseInt(Math.random() * (fi - 1))) + 1;
      if(key > 1 && key < fi && gcd(key, fi) == 1) break;
    }
    return key;
  }

  function findPrivateKey(fi, e) {
    var key = 0;
    while(true) {
      if((key * e) % fi == 1) break;
      key++;
    }
    return key;
  }

  this.person = name;
  this.p = 13;
  this.q = 11;
  this.n = this.p * this.q;
  this.fi = (this.p - 1) * (this.q - 1);
  this.e = findPublicKey(this.fi);
  this.d = findPrivateKey(this.fi, this.e);

}

mCrypt.prototype.enc = function(msg, rpu) {
  // body...
  var n = this.n;
  return msg.split("").map(function(item) {
    var num = item.charCodeAt(0) - 65;
    var pow = Math.pow(num, rpu);
    var en = (pow % n);
    console.log(item + " -> " + en);
    return en;

  }).join(":");
};

mCrypt.prototype.dec = function(msg) {
  // body...
  var self = this;
  return msg.split(":").map(function(item) {
    var num = parseInt(item);
    var pow = Math.pow(num, self.d);
    var ascii = pow % self.n;
    var ch = String.fromCharCode(ascii + 65);
    console.log(item + " -> " + ch);
    return ch; 
  }).join("");
};

$(document).ready(function(){

  var a = new mCrypt('Person-A');
  $("#Apu").text(a.e);
  $("#Apr").text(a.d);

  var b = new mCrypt('Person-B');
  $("#Bpu").text(b.e);
  $("#Bpr").text(b.d);

  $("#initBtn").on('click', function() {

    var encMsg = a.enc("Hello", b.e);
    console.log(encMsg);

    var plainMsg = b.dec(encMsg);
    console.log(plainMsg);
  });
});