import React, {useState, useCallback} from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import {View, Text, ScrollView} from 'react-native'
import {useFocusEffect} from '@react-navigation/native'


import styles from './styles'
import {PageHeader} from '../../components/PageHeader'
import {TeacherItem} from '../../components/TeacherItem'
import {Teacher} from '../../components/TeacherItem/TeacherItem'

const Favorites:React.FC = () => {

  const [favorites, setFavorites] = useState([])

  function loadFavorites() {
    AsyncStorage.getItem('@proffy:favorites').then(response => {
      if(response) {
         const favoritedTeachers = JSON.parse(response)
         setFavorites(favoritedTeachers)
      }
    })
  }

useFocusEffect(
  useCallback(() => {
    loadFavorites();
  }, [])
)

  return (
    <View style={styles.container}>
      <PageHeader title="Meus Proffys disponiveis" />     

      <ScrollView
        style={styles.teacherList}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 24
        }}
      >
        {favorites.map((teacher: Teacher) => (
          <TeacherItem key={teacher.id} teacher={teacher} favorited />
        ))}
      </ScrollView>
    </View>
  )
}

export default Favorites
