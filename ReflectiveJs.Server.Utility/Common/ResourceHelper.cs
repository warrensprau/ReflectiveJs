using System;
using System.Resources;

namespace ReflectiveJs.Server.Utility.Common
{
    public static class ResourceHelper
    {
        //private static readonly ResourceManager ResourceManager = new ResourceManager(typeof(Messages));

        public static string Message(string name, Type resourceSource)
        {
            try
            {
                return new ResourceManager(resourceSource).GetString(name);
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public static string EnumMessage(string name, Type resourceSource)
        {
            try
            {
                return new ResourceManager(resourceSource).GetString("Enum_" + name) ?? name;
            }
            catch (Exception e)
            {
                return name;
            }
        }

        public static string ErrorMessage(Error error)
        {
            var message = "An error has occurred.";

            if (error.DefaultText != null)
            {
                message = error.DefaultText;
            }
            else
            {
                var parameters = error.Parameters ?? new object[] {};
                message = string.Format(error.Template, parameters);
            }

            return message;
        }
    }
}