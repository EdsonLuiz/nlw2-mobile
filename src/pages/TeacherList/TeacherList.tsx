import React, {useState, useEffect} from 'react'
import {View, Text, ScrollView, TextInput} from 'react-native'
import {Feather} from '@expo/vector-icons'
import AsyncStorage from '@react-native-community/async-storage'

import styles from './styles'
import {PageHeader} from '../../components/PageHeader'
import {TeacherItem} from '../../components/TeacherItem'
import {BorderlessButton, RectButton} from 'react-native-gesture-handler'
import api from '../../services/api'
import {Teacher} from '../../components/TeacherItem/TeacherItem'

const TeacherList:React.FC = () => {

  const [isFiltersVisible, setIsFiltersVisible] = useState(false)

  const [favorites, setFavorites] = useState<number[]>([])

  const [subject, setSubject] = useState('')
  const [week_day, setWeek_day] = useState('')
  const [time, setTime] = useState('')
  const [teachersList, setTeachersList] = useState([])


  function loadFavorites() {
    AsyncStorage.getItem('@proffy:favorites').then(response => {
      if(response) {
         const favoritedTeachers = JSON.parse(response)
         const favoritedTeachersIds = favoritedTeachers.map(( teacher: Teacher ) => (teacher.id))
         setFavorites(favoritedTeachersIds)
      }
    })
  }

  function handleToggleFiltersVisible() {
    setIsFiltersVisible(!isFiltersVisible)
  }

  async function handleFiltersSubmit() {
    loadFavorites()
    const formData = {
      subject,
      week_day,
      time
    }
    const response = await api.get('classes', {
      params: formData
    })

    setTeachersList(response.data)
    setIsFiltersVisible(false)
  }

  return (
    <View style={styles.container}>
      <PageHeader 
        title="Proffys disponiveis" 
        headerRight={(
          <BorderlessButton onPress={handleToggleFiltersVisible}>
            <Feather name="filter" size={20} color="#fff" />
          </BorderlessButton>
        )}>
        {isFiltersVisible && (
          <View style={styles.serachForm}>
            <Text style={styles.label}>Matéria</Text>
            <TextInput 
              style={styles.input}
              value={subject}
              onChangeText={text => setSubject(text)}
              placeholderTextColor='#c1bccc'
              placeholder="Qual a matéria" />

            <View style={styles.inputGroup}>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Dia da semana</Text>
                <TextInput 
                  style={styles.input}
                  value={week_day}
                  onChangeText={text => setWeek_day(text)}
                  placeholderTextColor='#c1bccc'
                  placeholder="Qual o dia" />
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.label}>Horário</Text>
                <TextInput 
                  style={styles.input}
                  value={time}
                  onChangeText={text => setTime(text)}
                  placeholderTextColor='#c1bccc'
                  placeholder="Qual horário" />
              </View>

            </View>
            <RectButton onPress={handleFiltersSubmit} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Filtrar</Text>
            </RectButton>

          </View>
        )}
      </PageHeader>

      <ScrollView
        style={styles.teacherList}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 24
        }}
      >
        {teachersList.map(( teacher: Teacher ) => (
          <TeacherItem 
            favorited={favorites.includes(teacher.id)}
            key={teacher.id} 
            teacher={teacher} />
        ))}
      </ScrollView>

    </View>
  )
}

export default TeacherList
