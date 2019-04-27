
import http_utils.Util
import org.apache.spark.SparkContext
import org.apache.spark.SparkConf
import com.google.gson.Gson
import org.apache.spark.sql.SparkSession

object Main {
    def main(args: Array[String]): Unit = {
        val spark = SparkSession.builder
          .appName("Hello, World")
          .master("spark://45.113.235.180:7077")
            .getOrCreate()
        println("Hello, World")
        spark.stop()
    }


}