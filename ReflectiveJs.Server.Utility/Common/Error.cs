namespace ReflectiveJs.Server.Utility.Common
{
    public class Error
    {
        public Error(string template, string[] parameters, ErrorSeverity severity, string defaultText)
        {
            Template = template;
            Parameters = parameters;
            DefaultText = defaultText;
            Severity = severity;
        }

        public string Template { get; set; }
        public string[] Parameters { get; set; }
        public string DefaultText { get; set; }
        public ErrorSeverity Severity { get; set; }
    }

    public enum ErrorSeverity
    {
        Warning,
        Error
    }
}