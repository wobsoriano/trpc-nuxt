<script setup lang="ts">
import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '~~/server/trpc/routers';

const { $client } = useNuxtApp();

type RouterOutput = inferRouterOutputs<AppRouter>;
type Activity = RouterOutput['todo']['onActivity'];

// 1. useQuery - Fetch todos
const { data: todos, refresh } = await $client.todo.list.useQuery();

// 2. useMutation - Add todo
const { mutate: addTodo } = $client.todo.add.useMutation();

// 3. useMutation - Toggle todo
const { mutate: toggleTodo } = $client.todo.toggle.useMutation();

// 4. useSubscription - Activity feed
const activities = ref<Activity[]>([]);

const validActivities = computed(() => {
  return activities.value.filter((a): a is Activity => {
    return a != null && typeof a === 'object' && 'type' in a && 'todo' in a && a.todo != null;
  });
});

const subscriptionResult = $client.todo.onActivity.useSubscription(undefined, {
  onStarted: () => {
    console.log('Subscription started');
  },
  onData: (activity) => {
    console.log('onData', activity);
    if (activity && typeof activity === 'object' && 'type' in activity && 'todo' in activity && activity.todo) {
      activities.value.unshift(activity);
      // Refresh the list when activity happens
      refresh();
    }
  },
  onError: (error) => {
    console.error('Subscription error:', error);
  },
  onComplete: () => {
    console.log('Subscription completed');
  },
  onConnectionStateChange(state) {
    console.log('Connection state changed:', state);
  },
});

watchEffect(() => {
  console.log('Subscription status:', subscriptionResult.status.value);
});

const newTitle = ref('');

async function handleAdd() {
  if (newTitle.value.trim()) {
    await addTodo({ title: newTitle.value });
    await refresh();
    newTitle.value = '';
  }
}

async function handleToggle(id: number) {
  await toggleTodo({ id });
  await refresh();
}
</script>

<template>
  <div class="app">
    <header>
      <h1>tRPC Nuxt Todo</h1>
      <p class="subtitle">
        Demonstrating useQuery, useMutation, and useSubscription
      </p>
    </header>

    <main>
      <!-- Todo section with form and list -->
      <section class="todos">
        <form class="todo-form" @submit.prevent="handleAdd">
          <input
            v-model="newTitle"
            type="text"
            placeholder="What needs to be done?"
            class="todo-input"
          >
          <button type="submit" class="add-button">
            Add
          </button>
        </form>

        <ul class="todo-list">
          <li v-for="todo in todos" :key="todo.id" class="todo-item">
            <label :class="{ completed: todo.completed }" class="todo-label">
              <input
                type="checkbox"
                :checked="todo.completed"
                class="todo-checkbox"
                @change="handleToggle(todo.id)"
              >
              <span class="todo-text">{{ todo.title }}</span>
            </label>
          </li>
          <li v-if="!todos || todos.length === 0" class="empty-state">
            No todos yet. Add one above!
          </li>
        </ul>
      </section>

      <!-- Activity feed sidebar -->
      <aside class="activity-feed">
        <h2>Live Activity</h2>
        <div v-if="validActivities.length === 0" class="empty-activity">
          No activity yet...
        </div>
        <ul v-else class="activity-list">
          <li v-for="(activity, index) in validActivities" :key="index" class="activity-item">
            <span class="badge" :class="activity.type">{{ activity.type }}</span>
            <span class="activity-text">{{ activity.todo.title }}</span>
          </li>
        </ul>
      </aside>
    </main>
  </div>
</template>

<style scoped>
.app {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  color: #1f2937;
}

header {
  text-align: center;
  margin-bottom: 3rem;
}

h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

main {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 768px) {
  main {
    grid-template-columns: 1fr;
  }
}

/* Todo Section */
.todos {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.todo-form {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.todo-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.todo-input:focus {
  outline: none;
  border-color: #2563eb;
}

.add-button {
  padding: 0.75rem 1.5rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-button:hover {
  background: #1d4ed8;
}

.add-button:active {
  transform: scale(0.98);
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.todo-item {
  margin-bottom: 0.5rem;
}

.todo-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.todo-label:hover {
  background: #f9fafb;
}

.todo-label.completed {
  opacity: 0.6;
}

.todo-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  accent-color: #2563eb;
}

.todo-text {
  flex: 1;
  font-size: 1rem;
}

.todo-label.completed .todo-text {
  text-decoration: line-through;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: #9ca3af;
  font-style: italic;
}

/* Activity Feed */
.activity-feed {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 2rem;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
}

.activity-feed h2 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.empty-activity {
  padding: 2rem;
  text-align: center;
  color: #9ca3af;
  font-style: italic;
}

.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
  font-size: 0.875rem;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge.added {
  background: #dbeafe;
  color: #1e40af;
}

.badge.toggled {
  background: #fef3c7;
  color: #92400e;
}

.activity-text {
  flex: 1;
  color: #374151;
}
</style>
