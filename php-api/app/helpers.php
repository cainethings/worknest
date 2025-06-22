<?php
function findPhoneInCsv($phone) {
    $dataDir = __DIR__ . '/../data';
    $results = [];
    foreach (glob($dataDir . '/*.csv') as $file) {
        if (($handle = fopen($file, 'r')) !== false) {
            $header = fgetcsv($handle);
            while (($row = fgetcsv($handle)) !== false) {
                $record = array_combine($header, $row);
                if ($record['phone_number'] === $phone || $record['phone'] === $phone) {
                    $results[basename($file, '.csv')] = $record;
                    break;
                }
            }
            fclose($handle);
        }
    }
    return $results;
}

function listMonthFiles() {
    $dataDir = __DIR__ . '/../data';
    $files = [];
    foreach (glob($dataDir . '/*.csv') as $file) {
        $files[] = basename($file);
    }
    sort($files);
    return $files;
}

function getPayslipRecord($monthFile, $phone) {
    $path = __DIR__ . '/../data/' . $monthFile;
    if (!file_exists($path)) {
        return null;
    }
    if (($handle = fopen($path, 'r')) !== false) {
        $header = fgetcsv($handle);
        while (($row = fgetcsv($handle)) !== false) {
            $record = array_combine($header, $row);
            if ($record['phone_number'] === $phone || $record['phone'] === $phone) {
                fclose($handle);
                return $record;
            }
        }
        fclose($handle);
    }
    return null;
}
