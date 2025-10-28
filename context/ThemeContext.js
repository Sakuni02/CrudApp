import { createContext, useState } from "react";
import { Appearance } from "react-native";
import { Color } from "../constants/Colors";


export const ThemeContext = createContext({});

export const ThemeProvider = ({ children }) => {
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

    const theme = colorScheme === "dark" ? Color.dark : Color.light;

    return (
        <ThemeContext.Provider value={{
            colorScheme, setColorScheme, theme
        }}>
            {children}
        </ThemeContext.Provider>
    );

}