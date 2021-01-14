//@refresh reset
import { StatusBar } from 'expo-status-bar';
import React,{useState, useCallback, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import { StyleSheet, Text, View } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';


const firebaseConfig={
apiKey: "AIzaSyCOtaTVlGZBhO5k96sqGR0FXdLcWdwj_98",
authDomain: "chat-app-737a5.firebaseapp.com",
databaseURL: "https://chat-app-737a5-default-rtdb.firebaseio.com",
projectId: "chat-app-737a5",
storageBucket: "chat-app-737a5.appspot.com",
messagingSenderId: "1010951401625",
appId: "1:1010951401625:web:059631c306630ed41a4808"
}

if(firebase.apps.length===0){
  firebase.initializeApp(firebaseConfig)
}

const db = firebase.firestore()
const chatsRef = db.collection('chats')



export default function App() {

const [user, setUser] = useState(null)
const [name, setName] = useState('') 
const [messages, setMessages] = useState([])

useEffect(()=>{

  readUser()
   const unsubscribe = chatsRef.onSnapshot((querySnapshot)=>{
   const messagesFirestore = querySnapshot 

      .docChanges()

      .filter(({type})=>type==='added')

      .map(({doc})=>{
        const message = doc.data()
        return{...message, createdAt:message.createdAt.toDate()}
      })

      .sort((a,b)=>{ b.createdAt.getTime() - a.createdAt.getTime() })

       appendMessages(messagesFirestore)
  })

      return()=>unsubscribe()
  },[])

const appendMessages = useCallback((messages)=>{
  setMessages((previousMessages)=>GiftedChat.append(previousMessages, messages))
},[messages])

async function readUser()
{
  const user = await AsyncStorage.getItem('user')
  if(user){
    setUser(JSON.parse(user))
  }
}

    async function handlePress()
    {
      const _id = Math.random().toString(36).substring(7)
      const user = {_id, name}
      await AsyncStorage.setItem('user', JSON.stringify(user))
      setUser(user)
    }

    async function handleSend(messages){
      const writes = messages.map((m)=>chatsRef.add(m))
      await Promise.all(writes)
    }

  if(!user){
  return (
    <View style={styles.container}>

    <TextInput style={styles.input} placeHolder="ENTER YOUR NAME" value={name}
    onChangeText={setName}>
   </TextInput>

    <Button onPress={handlePress} title="ENTER THE CHAT">  </Button>

    </View>
  );
}
    return<GiftedChat messages={messages} user={user} onSend={handleSend}> </GiftedChat>

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  
  input: {
    height:50,
    width:100,
    borderWidth:1,
    padding:50,
    marginBottom:20,
    borderColor: 'grey',
  },
});
