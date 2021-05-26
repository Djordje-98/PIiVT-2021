import Ajv from "ajv";

interface IAddCAtegory{
    name: string;
}

const ajv = new Ajv();

   const IAddCategoryValidator = ajv.compile({
      type: "object",
      properties: {
          name: {
              type: "string",
              minLength: 2,
              maxLength: 128,
          },
      },

      required: [
        "name",
      ],
      additionalProperties: false,
          
   });

export { IAddCAtegory };
export { IAddCategoryValidator };