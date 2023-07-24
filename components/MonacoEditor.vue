<script setup lang="ts">
import { onMounted,onUnmounted, watch, reactive, ref } from 'vue'
import loader from "@monaco-editor/loader";
import JSON5 from 'json5'
import { JSONPath } from 'jsonpath-plus';
import example from '~/utils/example';
import Cobalt from './Cobalt.json'


const editorRef = ref()
let monaco: typeof loader['init'] extends () => Promise<infer T> ? T : never
let editor: ReturnType<typeof monaco.editor.create>
const editorValue = ref('')

onMounted(async () => {
  monaco = await loader.init()

  editor = monaco.editor.create(editorRef.value, {
    // value: example,
    value: '',
    language: 'markdown',
  })

  monaco.editor.defineTheme('cobalt', Cobalt)
  monaco.editor.setTheme('cobalt')

  editor.onDidChangeModelContent(() => {
    editorValue.value = editor.getValue()
  })

  window.addEventListener('resize', updateDimensions);
})

onUnmounted(() => {
  window.removeEventListener('resize', updateDimensions);
})

function isValidJson(jsonString: string) {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (error) {
    return false;
  }
}

function jsonify() {
  try {
    const jsonLike = editor?.getValue()
    const json5 = JSON5.parse(jsonLike);
    const json = JSON.stringify(json5, null, 1)
    editor?.setValue(json)
    timelines.push({
      timestamp: Date.now(),
      action: Action.JSONIFY,
      content: json,
    })
  } catch (e) {
    console.log(e)
  }
}

async function pretty() {
  await editor?.getAction('editor.action.formatDocument')?.run()

  saveTimeline({
    action: Action.PRETTY,
    content: editor?.getValue() ?? '',
  })
}

function compress() {
}

function updateDimensions() {
  editor?.layout();
}

enum Action {
  ORIGIN = '初始',
  PRETTY = '美化',
  COMPRESS = '压缩',
  JSONIFY = '合法化',
  JSONPATH = 'JSON Path',
}

const timelines = reactive<Array<{
  timestamp: number,
  action: Action,
  content: string,
  summary?: string,
}>>([])

function saveTimeline(timeline: {
  action: Action,
  content: string,
  summary?: string,
}) {
  const timestamp = Date.now()
  timelines.push({
    timestamp,
    ...timeline,
  })
  currentTimeline.value = timestamp
}

const currentTimeline = ref<number>()

// Restore to a specific timeline and remove all timelines after it
function restore(timestamp: number) {
  const timeline = timelines.find((timeline) => timeline.timestamp === timestamp)
  if (timeline) {
    editor?.setValue(timeline.content)
    const index = timelines.indexOf(timeline)
    timelines.splice(index + 1)
    currentTimeline.value = timeline.timestamp
  }
}

function see(timestamp: number) {
  const timeline = timelines.find((timeline) => timeline.timestamp === timestamp)
  if (timeline) {
    editor?.setValue(timeline.content)
    currentTimeline.value = timeline.timestamp
  }
}

const path = ref('')

function getJson() {
  const json = editor?.getValue()
  console.log('getJson')
  if (json && isValidJson(json)) {
    try {
      const json5 = JSON5.parse(json);
      const result = JSONPath({
        path: path.value,
        json: json5,
        wrap: false,
      })
      console.log(result)
      if(result === undefined) {
        snackbar.value = true
        snackbar.text = '未找到结果'
        return
      }

      const json2 = JSON.stringify(result, null, 1)

      editor?.setValue(json2)

      saveTimeline({
        action: Action.JSONPATH,
        content: json2,
      })

    } catch (e) {
      console.log(e)
    }
  }
}

const enterSymbol = '\u23CE'

const snackbar = reactive({
  value: false,
  text: '',
  color: 'error',
  timeout: 2000,
})

function setExample() {
  editor?.setValue(example)
  saveTimeline({
    content: example,
    action: Action.ORIGIN,
  })
}

async function paste() {
  const text = await navigator.clipboard.readText()
  editor?.setValue(text)
  saveTimeline({
    content: text,
    action: Action.ORIGIN,
  })
}

const templates = [
  {
    label: '<span>\\$</span>',
    value: '<span>\\$</span>'
  },
  {
    label: '公众号广告',
    value: `## 💰 最后

最新的文章会发在公众号「楷鹏」，欢迎关注 🤩`
  }
]

const date = ref('')
function makeCover() {
  const week = getWeekOfYear(date.value ? new Date(date.value) : '')
  copy(`经济学人 💰 第 ${week} 周`)
}

const links = [
  {
    label: '封面制作',
    value: 'https://coverview.vercel.app/editor'
  },
  {
    label: 'MDNICE 编辑器',
    value: 'https://editor.mdnice.com/'
  },
  {
    label: 'Excalidraw',
    value: 'https://excalidraw.com/'
  }
]

function openLink(link: string) {
  window.open(link, '_blank')
}

const dialog = ref(false)

const wordPercentage = computed(() => {
  return calculateWordPercentage(editorValue.value)
})
</script>

<template>
  <div
    id="editor"
    ref="editorRef"
  />
  <div
    v-if="editorValue === undefined || editorValue === ''"
    class="empty-json"
  >
    <v-btn
      variant="outlined"
      @click="setExample"
    >
      示例
    </v-btn>
    <v-btn
      variant="outlined"
      @click="paste"
    >
      粘贴
    </v-btn>
  </div>
  <div
    class="control-container"
  >
    <div class="control-panel">
      <!-- <v-btn
        class="button"
        variant="tonal"
        @click="jsonify"
      >
        <template #prepend>
          <v-tooltip
            location="top"
          >
            <template #activator="{ props }">
              <v-icon
                v-bind="props"
                icon="mdi-help-circle-outline"
              />
            </template>
            尝试将非法的 JSON 转换为合法的 JSON
          </v-tooltip>
        </template>
        合法化
      </v-btn>
      <v-btn
        class="button"
        variant="tonal"
        @click="pretty"
      >
        <template #prepend>
          <v-tooltip
            location="top"
          >
            <template #activator="{ props }">
              <v-icon
                v-bind="props"
                icon="mdi-help-circle-outline"
              />
            </template>
            美化代码
          </v-tooltip>
        </template>
        美化
      </v-btn> -->
      <v-menu
        transition="scale-transition"
        open-on-hover
      >
        <template #activator="{ props }">
          <v-btn
            variant="tonal"
            v-bind="props"
          >
            快捷模板
            <v-icon
              icon="mdi-note-plus"
              color="#fff"
              size="x-large"
              end
            />
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in templates"
            :key="index"
          >
            <v-btn @click="copy(item.value)">
              {{ item.label }}
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu
        transition="scale-transition"
        open-on-hover
      >
        <template #activator="{ props }">
          <v-btn
            variant="tonal"
            v-bind="props"
          >
            快捷链接
            <v-icon
              icon="mdi-note-plus"
              color="#fff"
              size="x-large"
              end
            />
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in links"
            :key="index"
          >
            <v-btn @click="openLink(item.value)">
              {{ item.label }}
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-dialog
        v-model="dialog"
        width="auto"
      >
        <template #activator="{ props }">
          <v-btn
            variant="tonal"
            v-bind="props"
          >
            进度计算
            <v-icon
              icon="mdi-note-plus"
              color="#fff"
              size="x-large"
              end
            />
          </v-btn>
        </template>

        <v-card>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th class="text-left">
                    Paragraph
                  </th>
                  <th class="text-left">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in wordPercentage"
                  :key="item.paragraph"
                >
                  <td>{{ item.paragraph }}</td>
                  <td>{{ item.percentage }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              block
              @click="dialog = false"
            >
              Close Dialog
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div class="w-48">
        <v-text-field
          v-model="date"
          label="Cover"
          size="small"
          density="compact"
          placeholder="2023-06-10"
          hide-details
          clearable
          @keydown.enter="makeCover"
        >
          <template #append-inner>
            {{ enterSymbol }}
          </template>
        </v-text-field>
      </div>
      <!-- <v-btn
        class="button"
        variant="tonal"
        @click="compress"
      >
        <template #prepend>
          <v-tooltip
            location="top"
          >
            <template #activator="{ props }">
              <v-icon
                v-bind="props"
                icon="mdi-help-circle-outline"
              />
            </template>
            压缩代码
          </v-tooltip>
        </template>
        压缩
      </v-btn> -->
      <!-- <div class="w-48">
        <v-text-field
          v-model="path"
          label="JSON Path"
          size="small"
          density="compact"
          placeholder="回车获取结果"
          hide-details
          clearable
          @keydown.enter="getJson"
        >
          <template #append-inner>
            {{ enterSymbol }}
          </template>
        </v-text-field>
      </div> -->
    </div>
    <!-- <div
      v-if="timelines.length > 0"
      class="timeline"
    >
      <v-timeline
        direction="horizontal"
        side="end"
        density="compact"
        line-color="hsla(0, 0%, 100%, .2)"
      >
        <v-timeline-item
          v-for="timeline in timelines"
          :key="timeline.timestamp"
          dot-color="#6466e9"
          density="compact"
          size="small"
          fill-dot
        >
          <template #icon>
            <v-menu
              transition="scale-transition"
              open-on-hover
            >
              <template #activator="{ props }">
                <v-btn
                  variant="text"
                  v-bind="props"
                  @click="see(timeline.timestamp)"
                >
                  <v-icon
                    v-if="timeline.timestamp !== currentTimeline"
                    icon="mdi-backup-restore"
                    color="#fff"
                    size="x-large"
                  />
                  <v-icon
                    v-else
                    icon="mdi-map-marker"
                    color="#fff"
                    size="x-large"
                  />
                </v-btn>
              </template>
              <v-list>
                <v-list-item v-if="timeline.timestamp !== currentTimeline">
                  <v-btn @click="see(timeline.timestamp)">
                    查看该版本
                  </v-btn>
                </v-list-item>
                <v-list-item>
                  <v-btn @click="restore(timeline.timestamp)">
                    回退到该版本
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
          {{ timeline.action }}
        </v-timeline-item>
      </v-timeline>
    </div> -->
  </div>
  <v-snackbar
    v-model="snackbar.value"
    :timeout="snackbar.timeout"
    :color="snackbar.color"
  >
    {{ snackbar.text }}
  </v-snackbar>
  <div
    class="fixed right-4 bottom-2 flex gap-0.1 "
  >
    <v-btn
      href="https://github.com/Penggeor/Operation-Assistant"
      target="_blank"
      rounded="lg"
    >
      <v-icon
        icon="mdi-github"
        size="x-large"
      />
    </v-btn>
  </div>
</template>

<style scoped>
#editor {
  width: 100vw;
  height: 100vh;
}

.empty-json {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 1rem;
  /* flex-direction: column; */
  align-items: center;
  color: hsla(0, 0%, 100%, .4);
  font-size: 0.875rem;
}

.control-container {
  position: fixed;
  bottom: 6.25vh;
  left: 50%;
  padding: 24px;
  padding-bottom: 12px;
  border: 1px solid hsla(0, 0%, 100%, .2);
  border-radius: 8px;
  background: #191919;
  box-shadow: 0 4px 16px rgba(0, 0, 0, .6);
  transform: translateX(-50%);
  color: hsla(0, 0%, 100%, .4);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.control-panel {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.timeline {
  font-size: 0.875rem;
}

:deep(.v-timeline-item__body) {
  padding-block-start: 0.5rem !important;
}
</style>
