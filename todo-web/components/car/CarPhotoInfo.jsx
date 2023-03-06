import styles from './CarPhotoInfo.module.css';
import FormatTime from "../time/FormatTime";

export default ({
                    lotName,
                    carPlateNum,
                    floorName,
                    areaName,
                    parkNo,
                    imgUrl,
                    createTime,
                }) => {
    return <div className={styles.container}>
        <div className={styles.innerContainer}>
            <div className={styles.infoContainer}>
                <div>
                    <p className={`${styles.title} ${styles.bolder}`}>{carPlateNum}</p>
                    <p>所在楼层：</p>
                    <p>车位地点：</p>
                    <p>车位地址：</p>
                    <p>停车场：</p>
                    <p>更新时间：</p>
                </div>

                <div className={styles.textRight}>
                    <p className={`${styles.title} ${styles.bolder}`}>&nbsp;</p>
                    <p className={styles.bolder}>{floorName}</p>
                    <p className={styles.bolder}>{areaName}</p>
                    <p className={styles.bolder}>{parkNo}</p>
                    <p>{lotName}</p>
                    <p>
                        <FormatTime time={createTime}/>
                    </p>
                </div>
            </div>
            <div>
                <img className={styles.img} src={imgUrl}/>
            </div>
        </div>
    </div>
}