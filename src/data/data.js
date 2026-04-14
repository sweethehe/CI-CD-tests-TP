const promoCodes = [
    { code: "PERCENT20", type: "percentage", value: 20, minOrder: 10.00, expiresAt: "2099-12-31" },
    { code: "FIXED5", type: "fixed", value: 5, minOrder: 10.00, expiresAt: "2099-12-31" },
    { code: "EXPIRED", type: "fixed", value: 5, minOrder: 10.00, expiresAt: "2000-01-01" },
    { code: "PERCENT100", type: "percentage", value: 100, minOrder: 0.00, expiresAt: "2099-12-31" }
];

module.exports = { promoCodes };
