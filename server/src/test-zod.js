const { z } = require("zod");

const TestSchema = z.object({
  name: z.string(),
  age: z.number(),
});

console.log("✅ Zod working in backend!");
console.log(TestSchema.parse({ name: "Jane", age: 25 }));
