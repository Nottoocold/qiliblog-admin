import type { ModalProps } from 'antd';

export type BaseCreateModalProps<T> = ModalProps & {
  /**
   * 关闭回调
   * @returns void
   */
  onClose: () => void;
  /**
   * 创建成功回调
   */
  onCreateSuccess: (data: T) => void | Promise<void>;
};

export type BaseUpdateModalProps<T, O> = ModalProps & {
  /**
   * 关闭回调
   * @returns void
   */
  onClose: () => void;
  /**
   * 编辑的记录
   */
  editRecord: O;
  /**
   * 更新成功回调
   */
  onUpdateSuccess: (data: T) => void | Promise<void>;
};
