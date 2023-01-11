import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

/**
 * setup wsl2 ip to host
 *
 * @author sbx0
 * @since 2022/11/17
 */

public class WSL2Support {

    public static final String WSL_HOSTS = "/etc/hosts";
    public static final String WINDOWS_HOSTS = "/mnt/c/Windows/System32/drivers/etc/hosts";
    public static final String WSL_DOMAIN = "wsl2.sbx0.cn";
    public static final String WINDOWS_DOMAIN = "win.sbx0.cn";
    public static final String TODO_DOMAIN = "todo.sbx0.cn";

    public static void main(String[] args) {
//        List<String> lines = new ArrayList<>();
//        lines.add("168.0.0.1\twsl2.sbx0.cn");
//        lines.add("168.0.0.2\twin.sbx0.cn");
//        lines.add("168.0.0.3\ttodo.sbx0.cn");
//        handleLines("127.0.0.1", "127.0.0.2", lines);
//        System.out.println(lines);

        String wslIp = exec("ifconfig eth0 | grep -w inet | awk '{print $2}'");
        if ("".equals(wslIp)) {
            System.out.println("please 'apt install net-tools' first.");
        }
        String winIp = exec("cat /etc/resolv.conf | grep 'nameserver' | awk '{print $2}'");

        System.out.println("change wsl host");
        changeHost(WSL_HOSTS, wslIp, winIp);
        System.out.println("change windows host");
        changeHost(WINDOWS_HOSTS, wslIp, winIp);
    }

    public static void changeHost(String host, String wslIp, String winIp) {
        Path path = Paths.get(host);
        try {
            List<String> lines = Files.readAllLines(path);
            handleLines(wslIp, winIp, lines);
            write(host, lines);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static void handleLines(String wslIp, String winIp, List<String> lines) {
        boolean findWslDomain = false;
        boolean findWindowsDomain = false;
        boolean findTodoDomain = false;
        for (int i = 0, linesSize = lines.size(); i < linesSize; i++) {
            String line = lines.get(i);
            if (line.contains(WSL_DOMAIN)) {
                System.out.println(line + "\told");
                line = wslIp + "\t" + WSL_DOMAIN;
                System.out.println(line + "\tnew");
                lines.set(i, line);
                findWslDomain = true;
            } else if (line.contains(WINDOWS_DOMAIN)) {
                System.out.println(line + "\told");
                line = winIp + "\t" + WINDOWS_DOMAIN;
                System.out.println(line + "\tnew");
                lines.set(i, line);
                findWindowsDomain = true;
            } else if (line.contains(TODO_DOMAIN)) {
                System.out.println(line + "\told");
                line = wslIp + "\t" + TODO_DOMAIN;
                System.out.println(line + "\tnew");
                lines.set(i, line);
                findTodoDomain = true;
            }
        }
        if (!findWslDomain) {
            lines.add(wslIp + "\t" + WSL_DOMAIN);
        }
        if (!findWindowsDomain) {
            lines.add(winIp + "\t" + WINDOWS_DOMAIN);
        }
        if (!findTodoDomain) {
            lines.add(wslIp + "\t" + TODO_DOMAIN);
        }
    }

    public static void write(String file, List<String> contents) throws IOException {
        FileWriter fw = null;
        try {
            File f = new File(file);
            fw = new FileWriter(f, false);
        } catch (IOException e) {
            e.printStackTrace();
        }
        if (fw != null) {
            PrintWriter pw = new PrintWriter(fw);
            for (String line : contents) {
                pw.println(line);
            }
            pw.flush();
            fw.flush();
            pw.close();
            fw.close();
        }
    }

    public static String exec(String command) {
        String[] commands = {"/bin/sh", "-c", command};
        try {
            Process process = Runtime.getRuntime().exec(commands);
            InputStreamReader reader = new InputStreamReader(process.getInputStream());
            BufferedReader bufferedReader = new BufferedReader(reader);
            StringBuilder resultBuilder = new StringBuilder();
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                resultBuilder.append(line);
            }
            return resultBuilder.toString();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
