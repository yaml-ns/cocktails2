import {listCocktails} from "./cocktailList.js";

export const filterCocktails = () => {
    const form = document.getElementById("filter");
    const fields = form.querySelectorAll("input, select");
    fields.forEach((field) => {
        field.addEventListener("input", async () => {
            const formData = new FormData(form);
            const filters = Object.fromEntries(formData.entries());
            await listCocktails(1, filters);
        });
    });
}