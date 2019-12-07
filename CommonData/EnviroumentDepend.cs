using System.Diagnostics;
using System.IO;


namespace TestCOneConnection.CommonData
{
    public class EnviroumentDepend
    {
        public static string GetPathToContentRoot(bool isDevelopment)
        {
            string pathToContentRoot = "";
            if (isDevelopment)
            {
                pathToContentRoot = Directory.GetCurrentDirectory();
            }
            else
            {
                // получаем путь к файлу 
                var pathToExe = Process.GetCurrentProcess().MainModule.FileName;
                // путь к каталогу проекта
                pathToContentRoot = Path.GetDirectoryName(pathToExe);
            }
            return pathToContentRoot;
        }
    }
}
