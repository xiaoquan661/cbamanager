const crypto = require("crypto");
const KEY = "uVayqL4ONKjFbVzQ";
const ct = "jBrR9+5XbXQ/39QTLjLSNO+qbtr62/aBlyU+UmEafz5lW5xVXY1bE+Z7QDDjTgkKIFvaRfb2qJLgXFw4YGMH7NqObjYCb8L30qxrGst/M/XVK9iGZBZ/XIlKGaiCNbipdAnnBLf1r2g03hfWDh0JeUuNvM37z2Gva0hFAy1thWwACk4u8tQALQGX+KGgmvTDIdb8Zny/cYzqI6MCLBqYRqZTBU7+l1v5YyQjXNywz3+xIAMXa2cDCUcbw8Wdf4xw9/qHS5Dh0tQtScak6RYiVqLfvr04jpmHBpN2Ae/puPN1haBXgwXr6hneXPXkVneV/CKYZg4GgC5y32Yt/Tzbkmy/FQtQu7o7PP9kjUcgjbwP82sWhTfqQBsV1wjHkkdn1WA+8VQt6pcsqTLOflB0TjxONoqXC8ss82UcQHc/jRFWeBizADa9hPviRxFafy89JPo8PX4h/78xJb2koWOQPPMpey2PhHVo+G0KaxAXozk0qSNFrPhZmPrlebs35AtND5bN4PeZ7ymiwH1BQnAiXo4xcXSmgN7D2b2+qnEVnMov/V4cyq/aG8tPT1h4uTrVj/eqh/SYqO+Z1MULvs/xX+NC0G6IcfJQn1EFIxpFm9T/9TRWr3yauIflkVctjb2A8/5uSm92BzWYsmTxQxGcouQnJuoChtZRez+mBuLH9kOvngmdQXG6UcqTgiONb/tWDDuu8aOI3uxUvjx+wtIRXwq0+eIyVKATFQuKcXL3ucswIkNwn1056RnVxBhSD2/T";
try {
  const d = crypto.createDecipheriv("aes-128-ecb", Buffer.from(KEY, "utf8"), null);
  let out = Buffer.concat([d.update(Buffer.from(ct, "base64")), d.final()]).toString("utf8");
  console.log("DECRYPT OK, first 600 chars:");
  console.log(out.slice(0, 600));
} catch(e) { console.log("FAIL: " + e.message); }