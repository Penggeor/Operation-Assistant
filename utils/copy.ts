import { ElMessage } from 'element-plus'
import _copy from 'copy-to-clipboard';

export default function copy(text: string) {
  _copy(text);
  ElMessage.success({
    message: '复制成功：' + text,
    type: 'success',
    duration: 1000,
  });
}
