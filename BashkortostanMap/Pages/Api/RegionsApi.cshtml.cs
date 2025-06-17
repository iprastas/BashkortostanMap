using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace BashkortostanMap.Pages.Api
{
    public class RegionsApiModel : PageModel
    {
        public class RegionsApi
        {
            public string Name { get; set; }
            // ����� �������� ������ ��������, ��������, ����������
        }

        public JsonResult OnGet()
        {
            // ��������� ������ �� ����
            var regionsFromDb = new List<RegionsApi>
            {
                new RegionsApi { Name = "���" },
                new RegionsApi { Name = "�����������" },
                new RegionsApi { Name = "��������" }
            };
            return new JsonResult(regionsFromDb);
        }
        //public JsonResult OnGet()
        //{
        //    // ��������� ������ �� ����
        //    var regionsFromDb = new[] { "���", "�����������", "��������" };
        //    return new JsonResult(regionsFromDb);
        //}
    }
}
