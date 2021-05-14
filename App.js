import { StatusBar } from 'expo-status-bar';
import React, {useState, useCallback, useEffect} from 'react';
import { StyleSheet,
         Text, 
         View, 
         SafeAreaView ,
         TouchableOpacity,
         FlatList,
         Modal,
         TextInput,
         AsyncStorage,
        } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TaskList from './src/components/TaskList';
import * as Animatable from 'react-native-animatable';

const AnimatableBtn = Animatable.createAnimatableComponent(TouchableOpacity);

export default function App() {

    const [task, setTask] = useState([]);

    const [open, setOpen] = useState(false);

    const [input, setInput] = useState('');



    useEffect( () =>  {

     async function loadTasks(){
        const taskStorage = await AsyncStorage.getItem('@task');

        if(taskStorage){
          setTask(JSON.parse(taskStorage));
        }
      }

      loadTasks();

    }, []);



    useEffect( () => {
      async function saveTasks(){
        await AsyncStorage.setItem('@task', JSON.stringify(task));
      }

      saveTasks();

    }, [task]);

    function handleAdd(){
     if(input === '') return;

     const data = {
       key: input,
       task: input,
     };

     setTask([...task, data]);
     setOpen(false);
     setInput('');
    }

    const handleDelete = useCallback( (data) => {
        const find = task.filter( r => r.key !== data.key);
        setTask(find);
    })



  return (
    <SafeAreaView style={styles.container}>

      <StatusBar backgroundColor="orange" 
                 barStyle="white"/>

      <View style={styles.content}>
          <Text style={styles.title}>Minhas Tarefas !</Text>
      </View>

  
      <FlatList
      marginHorizontal={10}
      showsHorizontalScrollIndicator={false}
      data={task}
      keyExtractor={ (item) => String(item.key) }
      renderItem={  ( { item } ) => <TaskList data={item}  handleDelete={ handleDelete } /> }
      />


      <Modal animationType="slide" transparent={false} visible={open}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity   style={{marginLeft: 5, marginRight: 5}} onPress={ () => setOpen(false) }>
              <Ionicons name="md-arrow-back" size={40} color="#DD4414"/>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
                Nova Tarefa ?
            </Text>
          </View>
          <Animatable.View style={styles.modalBody}
            animation="fadeInUp"
            useNativeDriver>

            <TextInput
              multiline={true}
              placeholderTextColor="#747474"
              autoCorrect={false}
              placeholder="O que deseja lembrar ?"
              style={styles.input}
              value={input}
              onChangeText={ (texto) => setInput(texto) }
            />

            <TouchableOpacity style={styles.handleAdd} onPress={ handleAdd }>
              <Text style={styles.handleAddText}>Cadastrar</Text>
            </TouchableOpacity>
          </Animatable.View>
          <Text style={styles.rodapePag2}> ₢Ricardo-San </Text>
        </SafeAreaView>
      </Modal>

      <AnimatableBtn 
      style={styles.fab}
      useNativeDriver
      animation="bounceInUp"
      duration={1500} // Em milisegundos
      onPress={ () => setOpen(true) }
      >
        <Ionicons name="ios-add" size={35} color="orange"/>
      </AnimatableBtn>


      <Text style={styles.rodape}> ₢Ricardo-San </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171d31'
  },
  title:{
    marginTop: 30,
    paddingBottom: 10,
    fontSize: 25,
    textAlign: 'center',
    color: '#DD4414',
  },
  fab:{
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#DD4414',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    right: 25,
    bottom: 25,
    elevation: 2,
    zIndex: 9,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 3,
    },

  },  

  modal:{
    flex: 1,
    backgroundColor: '#171d31',
  },
  modalHeader:{
    marginLeft: 10,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle:{
    marginLeft: 15,
    fontSize: 23,
    color: '#DD4414',
  },
  modalBody:{
    marginTop: 15,
  },
  input:{
    fontSize: 15,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
    backgroundColor: "#FFF",
    padding: 9,
    height: 85,
    textAlignVertical: 'top',
    color: "#000",
    borderRadius: 5,
  },  
  handleAdd:{
    backgroundColor: "#DD4414",
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    borderRadius: 5,
  },
  handleAddText:{
    fontSize: 20,
  },
  rodape:{
    fontSize: 20,
    color: '#DD4414',
    textAlign: 'center',
    alignItems: 'center',
  },
  rodapePag2:{
    color: '#DD4414',
    fontSize: 20,
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    paddingTop: 340,
  },
});
