import { useTheme } from "../hooks/useTheme";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

const ErrorDisplay = ({
  error,
  onRetry,
  onHome,
  title = "Errore nel Sistema",
  showRetry = true,
  showHome = false,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Card className="max-w-md w-full text-center">
        <CardContent className="space-y-6 p-8">
          <div className="flex justify-center">
            <div
              className={`p-4 rounded-full ${
                isDarkMode ? "bg-red-900" : "bg-red-100"
              }`}
            >
              <AlertTriangle
                className={`w-12 h-12 ${
                  isDarkMode ? "text-red-400" : "text-red-600"
                }`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <CardTitle
              className={`text-xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {title}
            </CardTitle>

            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {error ||
                "Si è verificato un errore imprevisto durante il caricamento dei dati."}
            </p>
          </div>

          {typeof error === "object" && error.stack && (
            <details
              className={`text-left text-xs ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <summary className="cursor-pointer mb-2">
                Dettagli tecnici
              </summary>
              <pre
                className={`p-2 rounded border overflow-auto ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-600"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                {error.stack}
              </pre>
            </details>
          )}

          <div
            className={`text-sm space-y-2 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <p className="font-medium">Possibili soluzioni:</p>
            <ul className="text-left space-y-1 list-disc list-inside">
              <li>Verificare la connessione di rete</li>
              <li>Aggiornare la pagina</li>
              <li>Attendere qualche minuto e riprovare</li>
              <li>Contattare il supporto se il problema persiste</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {showRetry && onRetry && (
              <Button onClick={onRetry} className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>Riprova</span>
              </Button>
            )}

            {showHome && onHome && (
              <Button
                onClick={onHome}
                variant="secondary"
                className="flex items-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Button>
            )}
          </div>

          <div
            className={`text-xs ${
              isDarkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Errore rilevato alle {new Date().toLocaleTimeString("it-IT")}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorDisplay;
