import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import { todo } from "../data/todos";

export default function Index() {
  const [getTodos, setTodos] = useState(todo.sort((a, b) => b.id - a.id));
  const [getText, setText] = useState("");

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

  const renderItem = ({ item }) => {
    return (
      <View style={styles.todoItem}>
        <Text
          style={[styles.text2, item.completed && styles.completedText]}
          onPress={() => toggleTodo(item.id)}
        >
          {item.title}
        </Text>
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
          placeholder="Add a new todo"
          placeholderTextColor="gray"
          value={getText}
          onChangeText={setText}
        />
        <Pressable style={styles.addButton} onPress={addTodo}>
          <Text style={styles.text1}>Add</Text>
        </Pressable>
      </View>

      <FlatList
        data={getTodos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        style={styles.flatList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  },
  addButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  text1: {
    color: "#fff",
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
