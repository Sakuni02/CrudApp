import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";

import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import Octicons from "@expo/vector-icons/Octicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import Animated, { LinearTransition } from "react-native-reanimated";

import { todo } from "../data/todos";

export default function Index() {
  const [getTodos, setTodos] = useState([]);
  const [getText, setText] = useState("");
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
  const router = useRouter();

  const [loaded, error] = useFonts({
    Inter_500Medium,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp");
        const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null;

        if (storageTodos && storageTodos.length) {
          setTodos(storageTodos.sort((a, b) => b.id - a.id));
        } else {
          setTodos(todo.sort((a, b) => b.id - a.id));
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, [todo]);

  useEffect(() => {
    const storeData = async () => {
      try {
        const jsonValue = JSON.stringify(getTodos);
        await AsyncStorage.setItem("TodoApp", jsonValue);
      } catch (e) {
        console.error(e);
      }
    };

    storeData();
  }, [getTodos]);

  if (!loaded && !error) {
    return null;
  }

  const styles = createStyles(theme, colorScheme);

  const addTodo = () => {
    if (getText.trim()) {
      const newId = getTodos.length > 0 ? getTodos[0].id + 1 : 1;
      setTodos([{ id: newId, title: getText, complete: false }, ...getTodos]);
      setText("");
    }
  };

  const toggleTodo = (id) => {
    setTodos(
      getTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const removeTodo = (id) => {
    setTodos(getTodos.filter((todo) => todo.id != id));
  };

  const handlePress = (id) => {
    router.push(`/todos/${id}`);
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.todoItem}>
        <Pressable
          onPress={() => handlePress(item.id)}
          onLongPress={() => toggleTodo(item.id)}
        >
          <Text style={[styles.text2, item.completed && styles.completedText]}>
            {item.title}
          </Text>
        </Pressable>
        <Pressable onPress={() => removeTodo(item.id)}>
          <Icon name="trash" style={styles.icon} />
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          maxLength={30}
          placeholder="Add a new todo"
          placeholderTextColor="gray"
          value={getText}
          onChangeText={setText}
        />
        <Pressable style={styles.addButton} onPress={addTodo}>
          <Text style={styles.text1}>Add</Text>
        </Pressable>

        <Pressable
          onPress={() =>
            setColorScheme(colorScheme === "light" ? "dark" : "light")
          }
          style={{ marginLeft: 10 }}
        >
          {colorScheme === "dark" ? (
            <Octicons
              name="moon"
              size={36}
              color={theme.text}
              selectable={undefined}
              style={{ width: 30 }}
            />
          ) : (
            <Octicons
              name="sun"
              size={36}
              color={theme.text}
              selectable={undefined}
              style={{ width: 30 }}
            />
          )}
        </Pressable>
      </View>

      <Animated.FlatList
        data={getTodos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        style={styles.flatList}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode="on-drag"
      />
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.background,
    },
    inputContainer: {
      flexDirection: "row",
      marginBottom: 20,
    },
    textInput: {
      flex: 1,
      borderColor: "#ccc",
      borderWidth: 1,
      borderRadius: 8,
      padding: 10,
      marginRight: 10,
      fontFamily: "Inter_500Medium",
      color: theme.text,
    },
    addButton: {
      backgroundColor: theme.button,
      borderRadius: 8,
      paddingHorizontal: 16,
      justifyContent: "center",
    },
    text1: {
      color: colorScheme === "dark" ? "black" : "white",
      fontWeight: "bold",
    },
    flatList: {
      flexGrow: 1,
    },
    todoItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#f2f2f2",
      borderRadius: 8,
      padding: 10,
      marginBottom: 10,
    },
    text2: {
      fontSize: 16,
      fontFamily: "Inter_500Medium",
    },
    icon: {
      fontSize: 20,
      color: "red",
      borderWidth: 1,
      padding: 5,
      borderRadius: 20,
    },

    completedText: {
      textDecorationLine: "line-through",
      color: "gray",
    },
  });
}
