
function SomeComponent () {
  return <div class="SomeComponent">
    <SomeOtherComponent callback={() => foo + 1}>
      You have {numMessages} {numMessages > 1 ? 'messages' : 'message'}.
      {'I can write </div> here just to fuck with you'}
    </SomeOtherComponent>
    <div>Lorem ipsum</div>
  </div>;
}
