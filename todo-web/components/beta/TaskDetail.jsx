import styles from "./TaskDetail.module.css"
import Button from "../basic/Button";

export default function TaskDetail({current, setCurrent, changeTask}) {
    return <>
        <div className={`${styles.label}`}>{current?.categoryName}</div>
        <div className={`${styles.textAreaDiv}`}>
                        <textarea
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                }
                            }}
                            rows={1}
                            value={current?.taskName != null ? current?.taskName : ''}
                            onChange={(event) => {
                                setCurrent({
                                    ...current,
                                    taskName: event.target.value.trim()
                                })
                            }}
                            placeholder={"请输入任务名称"}
                            className={`${styles.textAreaNoBackground}`}/>
        </div>
        <div className={`${styles.label}`}>备注</div>
        <div className={`${styles.textAreaDiv}`}>
                        <textarea
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                }
                            }}
                            rows={3}
                            placeholder={"在此处插入笔记"}
                            value={current?.taskRemark != null ? current?.taskRemark : ''}
                            onChange={(event) => {
                                setCurrent({
                                    ...current,
                                    taskRemark: event.target.value.trim()
                                })
                            }}
                            className={`${styles.textAreaNoBackground}`}/>
        </div>
        <Button onClick={() => changeTask(current)}>
            保存
        </Button>
    </>
}