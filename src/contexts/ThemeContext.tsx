import React, { createContext, useState, useContext, useEffect } from "react";

type ThemeType = "light" | "dark" | "system";

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ThemeType>("system");

  useEffect(() => {
    // Check for saved theme preference in localStorage
    const savedTheme = localStorage.getItem("theme") as ThemeType;
    if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
      setTheme(savedTheme);
    }

    // Apply the theme to the document
    applyTheme(savedTheme || "system");
  }, []);

  const applyTheme = (newTheme: ThemeType) => {
    const root = window.document.documentElement;

    // Remove any existing theme classes
    root.classList.remove("light", "dark");

    // Apply the appropriate theme
    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(newTheme);
    }
  };

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleThemeChange }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Export the useTheme hook
export const useTheme = () => useContext(ThemeContext);
