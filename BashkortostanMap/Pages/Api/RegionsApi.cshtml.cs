using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace BashkortostanMap.Pages.Api
{
    public class RegionsApiModel : PageModel
    {
        public class RegionsApi
        {
            public string Name { get; set; }
            // Можно добавить другие свойства, например, координаты
        }

        public JsonResult OnGet()
        {
            // Симуляция данных из базы
            var regionsFromDb = new List<RegionsApi>
            {
                new RegionsApi { Name = "Уфа" },
                new RegionsApi { Name = "Стерлитамак" },
                new RegionsApi { Name = "Белорецк" }
            };
            return new JsonResult(regionsFromDb);
        }
        //public JsonResult OnGet()
        //{
        //    // Симуляция данных из базы
        //    var regionsFromDb = new[] { "Уфа", "Стерлитамак", "Белорецк" };
        //    return new JsonResult(regionsFromDb);
        //}
    }
}
