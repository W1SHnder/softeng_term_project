date_str = sys.argv[1:]
parsed_datetime = datetime.datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
print(parsed_datetime)
