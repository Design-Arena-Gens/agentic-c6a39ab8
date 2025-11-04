import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://agentic-c6a39ab8.vercel.app';

export default function CoursesScreen() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/courses`);
      setCourses(response.data.filter((c: any) => c.published));
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    const token = await AsyncStorage.getItem('token');
    try {
      await axios.post(
        `${API_URL}/api/courses/${courseId}/enroll`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'Enrolled successfully!');
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Enrollment failed'
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Courses</Text>
        <Text style={styles.subtitle}>
          Find the perfect course for your goals
        </Text>
      </View>

      <View style={styles.coursesContainer}>
        {courses.map((course) => (
          <View key={course.id} style={styles.courseCard}>
            <View style={styles.courseThumbnail} />
            <View style={styles.courseContent}>
              <View style={styles.badges}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{course.level}</Text>
                </View>
                <View style={[styles.badge, styles.badgeCategory]}>
                  <Text style={styles.badgeText}>{course.category}</Text>
                </View>
              </View>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.courseDescription} numberOfLines={2}>
                {course.description}
              </Text>
              <Text style={styles.instructor}>
                by {course.instructor?.name}
              </Text>
              <View style={styles.footer}>
                <Text style={styles.price}>
                  {course.price === 0 ? 'Free' : `$${course.price}`}
                </Text>
                <TouchableOpacity
                  style={styles.enrollButton}
                  onPress={() => handleEnroll(course.id)}
                >
                  <Text style={styles.enrollButtonText}>Enroll</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  coursesContainer: {
    padding: 16,
  },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  courseThumbnail: {
    height: 160,
    backgroundColor: '#38bdf8',
  },
  courseContent: {
    padding: 16,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeCategory: {
    backgroundColor: '#f3f4f6',
  },
  badgeText: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '600',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  instructor: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  enrollButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  enrollButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
